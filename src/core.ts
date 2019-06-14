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

import {assertInPatch, assertNoChildrenDeclaredYet, assertNotInAttributes, assertNoUnclosedTags, assertPatchElementNoExtras, assertPatchOuterHasParentNode, assertVirtualAttributesClosed, setInAttributes, setInSkip} from './assertions';
import {Context} from './context';
import {getFocusedPath, moveBefore} from './dom_util';
import {DEBUG} from './global';
import {getData} from './node_data';
import {createElement, createText} from './nodes';
import {Key, MatchFnDef, NameOrCtorDef, PatchFunction} from './types';

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
 * TODO(sparhami) We should just export argsBuilder directly when Closure
 * Compiler supports ES6 directly.
 */
function getArgsBuilder(): Array<{}|null|undefined>{
  return argsBuilder;
}


/**
 * Returns a patcher function that sets up and restores a patch context,
 * running the run function with the provided data.
 */
function createPatcher<T, R>(
    run: PatchFunction<T, R>,
    config: {
      matches?: MatchFnDef
    } = {}
) : PatchFunction<T, R> {
  const {
    matches = defaultMatchFn,
  } = config;

  const f: PatchFunction<T, R> = (node, fn, data) => {
    const prevContext = context;
    const prevDoc = doc;
    const prevFocusPath = focusPath;
    const prevArgsBuilder = argsBuilder;
    const prevCurrentNode = currentNode;
    const prevCurrentParent = currentParent;
    const prevMatchFn = matchFn;
    let previousInAttributes = false;
    let previousInSkip = false;

    doc = node.ownerDocument;
    context = new Context();
    matchFn = matches;
    argsBuilder = [];
    currentNode = null;
    currentParent = node.parentNode;
    focusPath = getFocusedPath(node, currentParent);

    if (DEBUG) {
      previousInAttributes = setInAttributes(false);
      previousInSkip = setInSkip(false);
    }

    try {
      const retVal = run(node, fn, data);
      if (DEBUG) {
        assertVirtualAttributesClosed();
      }

      return retVal;
    } finally {
      argsBuilder = prevArgsBuilder;
      currentNode = prevCurrentNode;
      currentParent = prevCurrentParent;
      focusPath = prevFocusPath;
      context.notifyChanges();

      // Needs to be done after assertions because assertions rely on state
      // from these methods.
      setInAttributes(previousInAttributes);
      setInSkip(previousInSkip);
      doc = prevDoc;
      context = prevContext;
      matchFn = prevMatchFn;
    }
  };
  return f;
}


/**
 * Patches the document starting at node with the provided function. This
 * function may be called during an existing patch operation.
 */
const runPatchInner = function<T>(
    node: Element|DocumentFragment,
    fn: (a: T|undefined) => void,
    data?: T|undefined
) : Node {
  currentNode = node;

  enterNode();
  fn(data);
  exitNode();

  if (DEBUG) {
    assertNoUnclosedTags(currentNode, node);
  }

  return node;
}


/**
 * Patches an Element with the the provided function. Exactly one top level
 * element call should be made corresponding to `node`.
 */
const runPatchOuter = function<T>(
    node: Element|DocumentFragment,
    fn: (a: T|undefined) => void,
    data?: T|undefined
) : Node|null {
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
    matchNode: Node, nameOrCtor: NameOrCtorDef, key: Key) : boolean {
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
) : boolean {
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
    assertInPatch('currentElement', doc!);
    assertNotInAttributes('currentElement');
  }
  return (currentParent) as HTMLElement;
}


/**
 * @return The Node that will be evaluated for the next instruction.
 */
function currentPointer(): Node {
  if (DEBUG) {
    assertInPatch('currentPointer', doc!);
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


const patchInner = createPatcher(runPatchInner);
const patchOuter = createPatcher(runPatchOuter);

/** */
export {
  alignWithDOM,
  getArgsBuilder,
  text,
  createPatcher,
  runPatchInner,
  runPatchOuter,
  patchInner,
  patchOuter,
  open,
  close,
  currentElement,
  currentPointer,
  skip,
  nextNode as skipNode,
};
