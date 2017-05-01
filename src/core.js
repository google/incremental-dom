/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NameOrCtorDef } from './types.js';
import {
  createElement,
  createText
} from './nodes.js';
import { getData } from './node_data.js';
import {
  assertInPatch,
  assertNoUnclosedTags,
  assertNotInAttributes,
  assertVirtualAttributesClosed,
  assertNoChildrenDeclaredYet,
  assertPatchElementNoExtras,
  assertPatchOuterHasParentNode,
  setInAttributes,
  setInSkip
} from './assertions.js';
import {
  getFocusedPath,
  moveBefore
} from './dom_util.js';
import { global } from './global.js';

/** @type {?Node} */
let currentNode = null;

/** @type {?Node} */
let currentParent = null;

/** @type {?Document} */
let doc = null;


/**
 * @param {!Array<!NodeData>} focusPath The nodes to mark.
 * @param {boolean} focused Whether or not they are focused.
 */
const markFocused = function(focusPath, focused) {
  for (let i = 0; i < focusPath.length; i += 1) {
    focusPath[i].focused = focused;
  }
};


/**
 * Returns a patcher function that sets up and restores a patch context,
 * running the run function with the provided data.
 * @param {function((!Element|!DocumentFragment),!function(T),T=): ?Node} run
 * @return {function((!Element|!DocumentFragment),!function(T),T=): ?Node}
 * @template T
 */
const patchFactory = function(run) {
  /**
   * TODO(moz): These annotations won't be necessary once we switch to Closure
   * Compiler's new type inference. Remove these once the switch is done.
   *
   * @param {(!Element|!DocumentFragment)} node
   * @param {!function(T)} fn
   * @param {T=} data
   * @return {?Node} node
   * @template T
   */
  const f = function(node, fn, data) {
    const prevDoc = doc;
    const prevCurrentNode = currentNode;
    const prevCurrentParent = currentParent;
    let previousInAttributes = false;
    let previousInSkip = false;

    doc = node.ownerDocument;
    currentParent = node.parentNode;

    if (global.DEBUG) {
      previousInAttributes = setInAttributes(false);
      previousInSkip = setInSkip(false);
    }

    const focusPath = getFocusedPath(node, currentParent);
    markFocused(focusPath, true);
    const retVal = run(node, fn, data);
    markFocused(focusPath, false);

    if (global.DEBUG) {
      assertVirtualAttributesClosed();
      setInAttributes(previousInAttributes);
      setInSkip(previousInSkip);
    }

    doc = prevDoc;
    currentNode = prevCurrentNode;
    currentParent = prevCurrentParent;

    return retVal;
  };
  return f;
};


/**
 * Patches the document starting at node with the provided function. This
 * function may be called during an existing patch operation.
 * @param {!Element|!DocumentFragment} node The Element or Documen to patch.
 * @param {!function(T)} fn A function containing open/close/etc. calls that
 *     describe the DOM.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @return {!Node} The patched node.
 * @template T
 */
const patchInner = patchFactory(function(node, fn, data) {
  currentNode = node;

  enterNode();
  fn(data);
  exitNode();

  if (global.DEBUG) {
    assertNoUnclosedTags(currentNode, node);
  }

  return node;
});


/**
 * Patches an Element with the the provided function. Exactly one top level
 * element call should be made corresponding to `node`.
 * @param {!Element} node The Element where the patch should start.
 * @param {!function(T)} fn A function containing open/close/etc. calls that
 *     describe the DOM. This should have at most one top level element call.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @return {?Node} The node if it was updated, its replacedment or null if it
 *     was removed.
 * @template T
 */
const patchOuter = patchFactory(function(node, fn, data) {
  let startNode = /** @type {!Element} */({ nextSibling: node });
  let expectedNextNode = null;
  let expectedPrevNode = null;

  if (global.DEBUG) {
    assertPatchOuterHasParentNode(currentParent);
    expectedNextNode = node.nextSibling;
    expectedPrevNode = node.previousSibling;
  }

  currentNode = startNode;
  fn(data);

  if (global.DEBUG) {
    assertPatchElementNoExtras(startNode, currentNode, expectedNextNode,
        expectedPrevNode);
  }

  clearUnvisitedDOM(currentNode.nextSibling, node.nextSibling);

  return (startNode === currentNode) ? null : currentNode;
});


/**
 * Checks whether or not the current node matches the specified nameOrCtor and
 * key.
 *
 * @param {!Node} matchNode A node to match the data to.
 * @param {NameOrCtorDef} nameOrCtor The name or constructor to check for.
 * @param {?string=} key An optional key that identifies a node.
 * @param {*=} typeId An type identifier that avoids reuse between elements that
 *     would otherwise match.
 * @return {boolean} True if the node matches, false otherwise.
 */
const matches = function(matchNode, nameOrCtor, key, typeId) {
  const data = getData(matchNode);

  // Key check is done using double equals as we want to treat a null key the
  // same as undefined. This should be okay as the only values allowed are
  // strings, null and undefined so the == semantics are not too weird.
  return nameOrCtor === data.nameOrCtor &&
         typeId === data.typeId &&
         key == data.key;
};


/**
 * Aligns the virtual Node definition with the actual DOM, moving the
 * corresponding DOM node to the correct location or creating it if necessary.
 * @param {NameOrCtorDef} nameOrCtor The name or constructor for the Node.
 * @param {?string=} key The key used to identify the Node..
 * @param {*=} typeId An type identifier that avoids reuse between elements that
 *     would otherwise match.
 */
const alignWithDOM = function(nameOrCtor, key, typeId) {
  if (currentNode && matches(currentNode, nameOrCtor, key, typeId)) {
    return;
  }

  const parentData = getData(currentParent);
  const keyMap = parentData.keyMap;
  let node;

  // Check to see if the node has moved within the parent.
  if (key) {
    const keyNode = keyMap[key];
    if (keyNode && matches(keyNode, nameOrCtor, key, typeId)) {
      node = keyNode;
    }
  }

  // Create the node if it doesn't exist.
  if (!node) {
    if (nameOrCtor === '#text') {
      node = createText(doc);
    } else {
      node = createElement(doc, currentParent, nameOrCtor, key, typeId);
      if (key) {
        keyMap[key] = node;
      }
    }
  }

  // Re-order the node into the right position, preserving focus if either
  // node or currentNode are focused by making sure that they are not detached
  // from the DOM.
  if (getData(node).focused) {
    // Move everything else before the node.
    moveBefore(currentParent, node, currentNode);
  } else {
    currentParent.insertBefore(node, currentNode);
  }

  currentNode = node;
};


/**
 * Clears out any unvisited Nodes in a given range.
 * @param {?Node} startNode The node to start clearing from, inclusive.
 * @param {?Node} endNode The node to clear until, exclusive.
 */
const clearUnvisitedDOM = function(startNode, endNode) {
  const data = getData(currentParent);
  const keyMap = data.keyMap;
  let child = startNode;

  while (child !== endNode) {
    const next = child.nextSibling;
    const key = getData(child).key;
    currentParent.removeChild(child);
    if (key && keyMap[key] === child) {
      delete keyMap[key];
    }
    child = next;
  }
};


/**
 * Changes to the first child of the current node.
 */
const enterNode = function() {
  currentParent = currentNode;
  currentNode = null;
};


/**
 * @return {?Node} The next Node to be patched.
 */
const getNextNode = function() {
  if (currentNode) {
    return currentNode.nextSibling;
  } else {
    return currentParent.firstChild;
  }
};


/**
 * Changes to the next sibling of the current node.
 */
const nextNode = function() {
  currentNode = getNextNode();
};


/**
 * Changes to the parent of the current node, removing any unvisited children.
 */
const exitNode = function() {
  clearUnvisitedDOM(getNextNode(), null);

  currentNode = currentParent;
  currentParent = currentParent.parentNode;
};


/**
 * Makes sure that the current node is an Element with a matching nameOrCtor and
 * key.
 *
 * @param {NameOrCtorDef} nameOrCtor The tag or constructor for the Element.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {*=} typeId An type identifier that avoids reuse between elements that
 *     would otherwise match.
 * @return {!Element} The corresponding Element.
 */
const open = function(nameOrCtor, key, typeId) {
  nextNode();
  alignWithDOM(nameOrCtor, key, typeId);
  enterNode();
  return /** @type {!Element} */(currentParent);
};


/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 *
 * @return {!Element} The corresponding Element.
 */
const close = function() {
  if (global.DEBUG) {
    setInSkip(false);
  }

  exitNode();
  return /** @type {!Element} */(currentNode);
};


/**
 * Makes sure the current node is a Text node and creates a Text node if it is
 * not.
 *
 * @return {!Text} The corresponding Text Node.
 */
const text = function() {
  nextNode();
  alignWithDOM('#text', null);
  return /** @type {!Text} */(currentNode);
};


/**
 * Gets the current Element being patched.
 * @return {!Element}
 */
const currentElement = function() {
  if (global.DEBUG) {
    assertInPatch('currentElement', doc);
    assertNotInAttributes('currentElement');
  }
  return /** @type {!Element} */(currentParent);
};


/**
 * @return {Node} The Node that will be evaluated for the next instruction.
 */
const currentPointer = function() {
  if (global.DEBUG) {
    assertInPatch('currentPointer', doc);
    assertNotInAttributes('currentPointer');
  }
  return getNextNode();
};


/**
 * Skips the children in a subtree, allowing an Element to be closed without
 * clearing out the children.
 */
const skip = function() {
  if (global.DEBUG) {
    assertNoChildrenDeclaredYet('skip', currentNode);
    setInSkip(true);
  }
  currentNode = currentParent.lastChild;
};


/**
 * Skips the next Node to be patched, moving the pointer forward to the next
 * sibling of the current pointer.
 */
const skipNode = nextNode;


/** */
export {
  text,
  patchInner,
  patchOuter,
  open,
  close,
  currentElement,
  currentPointer,
  skip,
  skipNode
};
