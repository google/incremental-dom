/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
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

import {assertInPatch, assertNoChildrenDeclaredYet, assertNotInAttributes, assertNoUnclosedTags, assertPatchElementNoExtras, assertPatchOuterHasParentNode, assertVirtualAttributesClosed, setInAttributes, setInSkip, updatePatchContext} from './assertions';
import {Context} from './context';
import {getFocusedPath, moveBefore} from './dom_util';
import {DEBUG} from './global';
import {getData} from './node_data';
import {createElement, createText} from './nodes';
import {Key, MatchFnDef, NameOrCtorDef, PatchConfig, PatchFunction} from './types';

let context: Context|null = null;

let currentNode: Node|null = null;

let currentParent: Node|null = null;

let doc: Document|null = null;

let focusPath: Array<Node> = [];

let matchFn: MatchFnDef = defaultMatchFn;

/**
 * Used to build up call arguments. Each patch call gets a separate copy, so
 * this works with nested calls to patch.
 */
let argsBuilder: Array<{}|null|undefined> = [];

/**
 * Used to build up attrs for the an element.
 */
let attrsBuilder: Array<any> = [];


/**
 * TODO(sparhami) We should just export argsBuilder directly when Closure
 * Compiler supports ES6 directly.
 */
function getArgsBuilder(): Array<{}|null|undefined> {
  return argsBuilder;
}


/**
 * TODO(sparhami) We should just export argsBuilder directly when Closure
 * Compiler supports ES6 directly.
 */
function getAttrsBuilder(): Array<any> {
  return attrsBuilder;
}

/**
 * Returns a patcher function that sets up and restores a patch context,
 * running the run function with the provided data.
 */
function createPatcher<T, R>(
    run: PatchFunction<T, R>,
    patchConfig: PatchConfig = {},
): PatchFunction<T, R> {
  const {
    matches = defaultMatchFn,
  } = patchConfig;

  const f: PatchFunction<T, R> = (node, fn, data) => {
    const prevContext = context;
    const prevDoc = doc;
    const prevFocusPath = focusPath;
    const prevArgsBuilder = argsBuilder;
    const prevAttrsBuilder = attrsBuilder;
    const prevCurrentNode = currentNode;
    const prevCurrentParent = currentParent;
    const prevMatchFn = matchFn;
    let previousInAttributes = false;
    let previousInSkip = false;

    doc = node.ownerDocument;
    context = new Context();
    matchFn = matches;
    argsBuilder = [];
    attrsBuilder = [];
    currentNode = null;
    currentParent = node.parentNode;
    focusPath = getFocusedPath(node, currentParent);

    if (DEBUG) {
      previousInAttributes = setInAttributes(false);
      previousInSkip = setInSkip(false);
      updatePatchContext(context);
    }

    try {
      const retVal = run(node, fn, data);
      if (DEBUG) {
        assertVirtualAttributesClosed();
      }

      return retVal;
    } finally {
      context.notifyChanges();

      doc = prevDoc;
      context = prevContext;
      matchFn = prevMatchFn;
      argsBuilder = prevArgsBuilder;
      attrsBuilder = prevAttrsBuilder;
      currentNode = prevCurrentNode;
      currentParent = prevCurrentParent;
      focusPath = prevFocusPath;

      // Needs to be done after assertions because assertions rely on state
      // from these methods.
      if (DEBUG) {
        setInAttributes(previousInAttributes);
        setInSkip(previousInSkip);
        updatePatchContext(context);
      }
    }
  };
  return f;
}


/**
 * Creates a patcher that patches the document starting at node with a
 * provided function. This function may be called during an existing patch operation.
 */
function createPatchInner<T>(patchConfig?: PatchConfig):
    PatchFunction<T, Node> {
  return createPatcher((node, fn, data) => {
    currentNode = node;

    enterNode();
    fn(data);
    exitNode();

    if (DEBUG) {
      assertNoUnclosedTags(currentNode, node);
    }

    return node;
  }, patchConfig);
}


/**
 * Patches an Element with the the provided function. Exactly one top level
 * element call should be made corresponding to `node`.
 */
function createPatchOuter<T>(patchConfig?: PatchConfig):
    PatchFunction<T, Node|null> {
  return createPatcher((node, fn, data) => {
    // tslint:disable-next-line:no-any
    const startNode = (({nextSibling: node}) as any) as Element;
    let expectedNextNode: Node|null = null;
    let expectedPrevNode: Node|null = null;

    if (DEBUG) {
      expectedNextNode = node.nextSibling;
      expectedPrevNode = node.previousSibling;
    }

    currentNode = startNode;
    fn(data);

    if (DEBUG) {
      assertPatchOuterHasParentNode(currentParent);
      assertPatchElementNoExtras(
          startNode, currentNode, expectedNextNode, expectedPrevNode);
    }

    if (currentParent) {
      clearUnvisitedDOM(currentParent, getNextNode(), node.nextSibling);
    }

    return (startNode === currentNode) ? null : currentNode;
  }, patchConfig);
}


/**
 * Checks whether or not the current node matches the specified nameOrCtor and
 * key. This uses the specified match function when creating the patcher.
 * @param matchNode A node to match the data to.
 * @param nameOrCtor The name or constructor to check for.
 * @param key The key used to identify the Node.
 * @return True if the node matches, false otherwise.
 */
function matches(
    matchNode: Node, nameOrCtor: NameOrCtorDef, key: Key): boolean {
  const data = getData(matchNode, key);

  return matchFn(matchNode, nameOrCtor, data.nameOrCtor, key, data.key);
}


/**
 * The default match function to use, if one was not specified when creating
 * the patcher.
 * @param matchNode The node to match against, unused.
 * @param nameOrCtor The name or constructor as declared.
 * @param expectedNameOrCtor The name or constructor of the existing node.
 * @param key The key as declared.
 * @param expectedKey The key of the existing node.
 */
function defaultMatchFn(
    matchNode: Node,
    nameOrCtor: NameOrCtorDef,
    expectedNameOrCtor: NameOrCtorDef,
    key: Key,
    expectedKey: Key,
): boolean {
  // Key check is done using double equals as we want to treat a null key the
  // same as undefined. This should be okay as the only values allowed are
  // strings, null and undefined so the == semantics are not too weird.
  // tslint:disable-next-line:triple-equals
  return nameOrCtor == expectedNameOrCtor && key == expectedKey;
}


/**
 * Finds the matching node, starting at `node` and looking at the subsequent
 * siblings if a key is used.
 * @param node The node to start looking at.
 * @param nameOrCtor The name or constructor for the Node.
 * @param key The key used to identify the Node.
 */
function getMatchingNode(
    matchNode: Node|null, nameOrCtor: NameOrCtorDef, key: Key): Node|null {
  if (!matchNode) {
    return null;
  }

  if (matches(matchNode, nameOrCtor, key)) {
    return matchNode;
  }

  if (key) {
    while ((matchNode = matchNode.nextSibling)) {
      if (matches(matchNode, nameOrCtor, key)) {
        return matchNode;
      }
    }
  }

  return null;
}


/**
 * Creates a Node and marking it as created.
 * @param nameOrCtor The name or constructor for the Node.
 * @param key The key used to identify the Node.
 * @return The newly created node.
 */
function createNode(nameOrCtor: NameOrCtorDef, key:Key): Node {
  let node;

  if (nameOrCtor === '#text') {
    node = createText(doc!);
  } else {
    node = createElement(doc!, currentParent!, nameOrCtor, key);
  }

  context!.markCreated(node);

  return node;
}


/**
 * Aligns the virtual Node definition with the actual DOM, moving the
 * corresponding DOM node to the correct location or creating it if necessary.
 * @param nameOrCtor The name or constructor for the Node.
 * @param key The key used to identify the Node.
 */
function alignWithDOM(nameOrCtor: NameOrCtorDef, key: Key) {
  nextNode();
  const existingNode = getMatchingNode(currentNode, nameOrCtor, key);
  const node = existingNode || createNode(nameOrCtor, key);

  // If we are at the matching node, then we are done.
  if (node === currentNode) {
    return;
  }

  // Re-order the node into the right position, preserving focus if either
  // node or currentNode are focused by making sure that they are not detached
  // from the DOM.
  if (focusPath.indexOf(node) >= 0) {
    // Move everything else before the node.
    moveBefore(currentParent!, node, currentNode);
  } else {
    currentParent!.insertBefore(node, currentNode);
  }

  currentNode = node;
}


/**
 * Clears out any unvisited Nodes in a given range.
 * @param maybeParentNode
 * @param startNode The node to start clearing from, inclusive.
 * @param endNode The node to clear until, exclusive.
 */
function clearUnvisitedDOM(
    maybeParentNode: Node|null, startNode: Node|null, endNode: Node|null) {
  const parentNode = maybeParentNode!;
  let child = startNode;

  while (child !== endNode) {
    const next = child!.nextSibling;
    parentNode.removeChild(child!);
    context!.markDeleted(child!);
    child = next;
  }
}


/**
 * Changes to the first child of the current node.
 */
function enterNode() {
  currentParent = currentNode;
  currentNode = null;
}


/**
 * @return The next Node to be patched.
 */
function getNextNode(): Node|null {
  if (currentNode) {
    return currentNode.nextSibling;
  } else {
    return currentParent!.firstChild;
  }
}


/**
 * Changes to the next sibling of the current node.
 */
function nextNode() {
  currentNode = getNextNode();
}


/**
 * Changes to the parent of the current node, removing any unvisited children.
 */
function exitNode() {
  clearUnvisitedDOM(currentParent, getNextNode(), null);

  currentNode = currentParent;
  currentParent = currentParent!.parentNode;
}


/**
 * Makes sure that the current node is an Element with a matching nameOrCtor and
 * key.
 *
 * @param nameOrCtor The tag or constructor for the Element.
 * @param key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @return The corresponding Element.
 */
function open(nameOrCtor: NameOrCtorDef, key?: Key): HTMLElement {
  alignWithDOM(nameOrCtor, key);
  enterNode();
  return (currentParent as HTMLElement);
}


/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 */
function close() {
  if (DEBUG) {
    setInSkip(false);
  }

  exitNode();
  return (currentNode) as Element;
}


/**
 * Makes sure the current node is a Text node and creates a Text node if it is
 * not.
 */
function text(): Text {
  alignWithDOM('#text', null);
  return (currentNode) as Text;
}


/**
 * Gets the current Element being patched.
 */
function currentElement(): HTMLElement {
  if (DEBUG) {
    assertInPatch('currentElement');
    assertNotInAttributes('currentElement');
  }
  return (currentParent) as HTMLElement;
}


/**
 * @return The Node that will be evaluated for the next instruction.
 */
function currentPointer(): Node {
  if (DEBUG) {
    assertInPatch('currentPointer');
    assertNotInAttributes('currentPointer');
  }
  // TODO(tomnguyen): assert that this is not null
  return getNextNode()!;
}


/**
 * Skips the children in a subtree, allowing an Element to be closed without
 * clearing out the children.
 */
function skip() {
  if (DEBUG) {
    assertNoChildrenDeclaredYet('skip', currentNode);
    setInSkip(true);
  }
  currentNode = currentParent!.lastChild;
}


const patchInner = createPatchInner();
const patchOuter = createPatchOuter();

/** */
export {
  alignWithDOM,
  getArgsBuilder,
  getAttrsBuilder,
  text,
  createPatchInner,
  createPatchOuter,
  patchInner,
  patchOuter,
  open,
  close,
  currentElement,
  currentPointer,
  skip,
  nextNode as skipNode,
};
