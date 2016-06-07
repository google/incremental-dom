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

import {
  createElement,
  createText
} from './nodes';
import { getData } from './node_data';
import { Context } from './context';
import {
  assertInPatch,
  assertNoUnclosedTags,
  assertNotInAttributes,
  assertVirtualAttributesClosed,
  assertNoChildrenDeclaredYet,
  assertPatchElementNoExtras,
  setInAttributes,
  setInSkip
} from './assertions';
import {
  getFocusedPath,
  moveBefore
} from './dom_util';


/** @type {?Context} */
let context = null;

/** @type {?Node} */
let currentNode = null;

/** @type {?Node} */
let currentParent = null;

/** @type {?Document} */
let doc = null;


/**
 * @param {!Array<Node>} focusPath The nodes to mark.
 * @param {boolean} focused Whether or not they are focused.
 */
const markFocused = function(focusPath, focused) {
  for (let i = 0; i < focusPath.length; i += 1) {
    getData(focusPath[i]).focused = focused;
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
    const prevContext = context;
    const prevDoc = doc;
    const prevCurrentNode = currentNode;
    const prevCurrentParent = currentParent;
    let previousInAttributes = false;
    let previousInSkip = false;

    context = new Context();
    doc = node.ownerDocument;
    currentParent = node.parentNode;

    if (process.env.NODE_ENV !== 'production') {
      previousInAttributes = setInAttributes(false);
      previousInSkip = setInSkip(false);
    }

    const focusPath = getFocusedPath(node, currentParent);
    markFocused(focusPath, true);
    const retVal = run(node, fn, data);
    markFocused(focusPath, false);

    if (process.env.NODE_ENV !== 'production') {
      assertVirtualAttributesClosed();
      setInAttributes(previousInAttributes);
      setInSkip(previousInSkip);
    }

    context.notifyChanges();

    context = prevContext;
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
 * @param {!Element|!DocumentFragment} node The Element or Document
 *     to patch.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @return {!Node} The patched node.
 * @template T
 */
const patchInner = patchFactory(function(node, fn, data) {
  currentNode = node;

  enterNode();
  fn(data);
  exitNode();

  if (process.env.NODE_ENV !== 'production') {
    assertNoUnclosedTags(currentNode, node);
  }

  return node;
});


/**
 * Patches an Element with the the provided function. Exactly one top level
 * element call should be made corresponding to `node`.
 * @param {!Element} node The Element where the patch should start.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM. This should have at most one top level
 *     element call.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @return {?Node} The node if it was updated, its replacedment or null if it
 *     was removed.
 * @template T
 */
const patchOuter = patchFactory(function(node, fn, data) {
  let startNode = /** @type {!Element} */({ nextSibling: node });
  let expectedNextNode = null;
  let expectedPrevNode = null;

  if (process.env.NODE_ENV !== 'production') {
    expectedNextNode = node.nextSibling;
    expectedPrevNode = node.previousSibling;
  }

  currentNode = startNode;
  fn(data);

  if (process.env.NODE_ENV !== 'production') {
    assertPatchElementNoExtras(startNode, currentNode, expectedNextNode,
        expectedPrevNode);
  }

  if (node !== currentNode && node.parentNode) {
    removeChild(currentParent, node, getData(currentParent).keyMap);
  }

  return (startNode === currentNode) ? null : currentNode;
});


/**
 * Checks whether or not the current node matches the specified nodeName and
 * key.
 *
 * @param {!Node} matchNode A node to match the data to.
 * @param {?string} nodeName The nodeName for this node.
 * @param {?string=} key An optional key that identifies a node.
 * @return {boolean} True if the node matches, false otherwise.
 */
const matches = function(matchNode, nodeName, key) {
  const data = getData(matchNode);

  // Key check is done using double equals as we want to treat a null key the
  // same as undefined. This should be okay as the only values allowed are
  // strings, null and undefined so the == semantics are not too weird.
  return nodeName === data.nodeName && key == data.key;
};


/**
 * Aligns the virtual Element definition with the actual DOM, moving the
 * corresponding DOM node to the correct location or creating it if necessary.
 * @param {string} nodeName For an Element, this should be a valid tag string.
 *     For a Text, this should be #text.
 * @param {?string=} key The key used to identify this element.
 */
const alignWithDOM = function(nodeName, key) {
  if (currentNode && matches(currentNode, nodeName, key)) {
    return;
  }

  const parentData = getData(currentParent);
  const currentNodeData = currentNode && getData(currentNode);
  const keyMap = parentData.keyMap;
  let node;

  // Check to see if the node has moved within the parent.
  if (key) {
    const keyNode = keyMap[key];
    if (keyNode) {
      if (matches(keyNode, nodeName, key)) {
        node = keyNode;
      } else if (keyNode === currentNode) {
        context.markDeleted(keyNode);
      } else {
        removeChild(currentParent, keyNode, keyMap);
      }
    }
  }

  // Create the node if it doesn't exist.
  if (!node) {
    if (nodeName === '#text') {
      node = createText(doc);
    } else {
      node = createElement(doc, currentParent, nodeName, key);
    }

    if (key) {
      keyMap[key] = node;
    }

    context.markCreated(node);
  }

  // Re-order the node into the right position, preserving focus if either
  // node or currentNode are focused by making sure that they are not detached
  // from the DOM.
  if (getData(node).focused) {
    // Move everything else before the node.
    moveBefore(currentParent, node, currentNode);
  } else if (currentNodeData && currentNodeData.key && !currentNodeData.focused) {
    // Remove the currentNode, which can always be added back since we hold a
    // reference through the keyMap. This prevents a large number of moves when
    // a keyed item is removed or moved backwards in the DOM.
    currentParent.replaceChild(node, currentNode);
    parentData.keyMapValid = false;
  } else {
    currentParent.insertBefore(node, currentNode);
  }

  currentNode = node;
};


/**
 * @param {?Node} node
 * @param {?Node} child
 * @param {?Object<string, !Element>} keyMap
 */
const removeChild = function(node, child, keyMap) {
  node.removeChild(child);
  context.markDeleted(/** @type {!Node}*/(child));

  const key = getData(child).key;
  if (key) {
    delete keyMap[key];
  }
};


/**
 * Clears out any unvisited Nodes, as the corresponding virtual element
 * functions were never called for them.
 */
const clearUnvisitedDOM = function() {
  const node = currentParent;
  const data = getData(node);
  const keyMap = data.keyMap;
  const keyMapValid = data.keyMapValid;
  let child = node.lastChild;
  let key;

  if (child === currentNode && keyMapValid) {
    return;
  }

  while (child !== currentNode) {
    removeChild(node, child, keyMap);
    child = node.lastChild;
  }

  // Clean the keyMap, removing any unusued keys.
  if (!keyMapValid) {
    for (key in keyMap) {
      child = keyMap[key];
      if (child.parentNode !== node) {
        context.markDeleted(child);
        delete keyMap[key];
      }
    }

    data.keyMapValid = true;
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
  clearUnvisitedDOM();

  currentNode = currentParent;
  currentParent = currentParent.parentNode;
};


/**
 * Makes sure that the current node is an Element with a matching tagName and
 * key.
 *
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @return {!Element} The corresponding Element.
 */
const elementOpen = function(tag, key) {
  nextNode();
  alignWithDOM(tag, key);
  enterNode();
  return /** @type {!Element} */(currentParent);
};


/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 *
 * @return {!Element} The corresponding Element.
 */
const elementClose = function() {
  if (process.env.NODE_ENV !== 'production') {
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
  if (process.env.NODE_ENV !== 'production') {
    assertInPatch('currentElement', context);
    assertNotInAttributes('currentElement');
  }
  return /** @type {!Element} */(currentParent);
};


/**
 * @return {Node} The Node that will be evaluated for the next instruction.
 */
const currentPointer = function() {
  if (process.env.NODE_ENV !== 'production') {
    assertInPatch('currentPointer', context);
    assertNotInAttributes('currentPointer');
  }
  return getNextNode();
};


/**
 * Skips the children in a subtree, allowing an Element to be closed without
 * clearing out the children.
 */
const skip = function() {
  if (process.env.NODE_ENV !== 'production') {
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
  elementOpen,
  elementClose,
  text,
  patchInner,
  patchOuter,
  currentElement,
  currentPointer,
  skip,
  skipNode
};
