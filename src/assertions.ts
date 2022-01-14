//  Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import { DEBUG } from "./global";
import { NameOrCtorDef } from "./types";

/**
 * Keeps track whether or not we are in an attributes declaration (after
 * elementOpenStart, but before elementOpenEnd).
 */
let inAttributes = false;

/**
 * Keeps track whether or not we are in an element that should not have its
 * children cleared.
 */
let inSkip = false;

/**
 * Keeps track of whether or not we are in a patch.
 */
let inPatch = false;

/**
 * Asserts that a value exists and is not null or undefined. goog.asserts
 * is not used in order to avoid dependencies on external code.
 * @param val The value to assert is truthy.
 * @returns The value.
 */
function assert<T extends {}>(val: T | null | undefined): T {
  if (DEBUG && !val) {
    throw new Error("Expected value to be defined");
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return val!;
}

/**
 * Makes sure that there is a current patch context.
 * @param functionName The name of the caller, for the error message.
 */
function assertInPatch(functionName: string) {
  if (!inPatch) {
    throw new Error("Cannot call " + functionName + "() unless in patch.");
  }
}

/**
 * Makes sure that a patch closes every node that it opened.
 * @param openElement
 * @param root
 */
function assertNoUnclosedTags(
  openElement: Node | null,
  root: Node | DocumentFragment
) {
  if (openElement === root) {
    return;
  }

  let currentElement = openElement;
  const openTags: Array<string> = [];
  while (currentElement && currentElement !== root) {
    openTags.push(currentElement.nodeName.toLowerCase());
    currentElement = currentElement.parentNode;
  }

  throw new Error("One or more tags were not closed:\n" + openTags.join("\n"));
}

/**
 * Makes sure that node being outer patched has a parent node.
 * @param parent
 */
function assertPatchOuterHasParentNode(parent: Node | null) {
  if (!parent) {
    console.warn(
      "patchOuter requires the node have a parent if there is a key."
    );
  }
}

/**
 * Makes sure that the caller is not where attributes are expected.
 * @param functionName The name of the caller, for the error message.
 */
function assertNotInAttributes(functionName: string) {
  if (inAttributes) {
    throw new Error(
      functionName +
        "() can not be called between " +
        "elementOpenStart() and elementOpenEnd()."
    );
  }
}

/**
 * Makes sure that the caller is not inside an element that has declared skip.
 * @param functionName The name of the caller, for the error message.
 */
function assertNotInSkip(functionName: string) {
  if (inSkip) {
    throw new Error(
      functionName +
        "() may not be called inside an element " +
        "that has called skip()."
    );
  }
}

/**
 * Makes sure that the caller is where attributes are expected.
 * @param functionName The name of the caller, for the error message.
 */
function assertInAttributes(functionName: string) {
  if (!inAttributes) {
    throw new Error(
      functionName +
        "() can only be called after calling " +
        "elementOpenStart()."
    );
  }
}

/**
 * Makes sure the patch closes virtual attributes call
 */
function assertVirtualAttributesClosed() {
  if (inAttributes) {
    throw new Error(
      "elementOpenEnd() must be called after calling " + "elementOpenStart()."
    );
  }
}

/**
 * Makes sure that tags are correctly nested.
 * @param currentNameOrCtor
 * @param nameOrCtor
 */
function assertCloseMatchesOpenTag(
  currentNameOrCtor: NameOrCtorDef,
  nameOrCtor: NameOrCtorDef
) {
  if (currentNameOrCtor !== nameOrCtor) {
    throw new Error(
      'Received a call to close "' +
        nameOrCtor +
        '" but "' +
        currentNameOrCtor +
        '" was open.'
    );
  }
}

/**
 * Makes sure that no children elements have been declared yet in the current
 * element.
 * @param functionName The name of the caller, for the error message.
 * @param previousNode
 */
function assertNoChildrenDeclaredYet(
  functionName: string,
  previousNode: Node | null
) {
  if (previousNode !== null) {
    throw new Error(
      functionName +
        "() must come before any child " +
        "declarations inside the current element."
    );
  }
}

/**
 * Checks that a call to patchOuter actually patched the element.
 * @param maybeStartNode The value for the currentNode when the patch
 *     started.
 * @param maybeCurrentNode The currentNode when the patch finished.
 * @param expectedNextNode The Node that is expected to follow the
 *    currentNode after the patch;
 * @param expectedPrevNode The Node that is expected to preceed the
 *    currentNode after the patch.
 */
function assertPatchElementNoExtras(
  maybeStartNode: Node | null,
  maybeCurrentNode: Node | null,
  expectedNextNode: Node | null,
  expectedPrevNode: Node | null
) {
  const startNode = assert(maybeStartNode);
  const currentNode = assert(maybeCurrentNode);
  const wasUpdated =
    currentNode.nextSibling === expectedNextNode &&
    currentNode.previousSibling === expectedPrevNode;
  const wasChanged =
    currentNode.nextSibling === startNode.nextSibling &&
    currentNode.previousSibling === expectedPrevNode;
  const wasRemoved = currentNode === startNode;

  if (!wasUpdated && !wasChanged && !wasRemoved) {
    throw new Error(
      "There must be exactly one top level call corresponding " +
        "to the patched element."
    );
  }
}

/**
 * @param newContext The current patch context.
 */
function updatePatchContext(newContext: {} | null) {
  inPatch = newContext != null;
}

/**
 * Updates the state of being in an attribute declaration.
 * @param value Whether or not the patch is in an attribute declaration.
 * @return the previous value.
 */
function setInAttributes(value: boolean) {
  const previous = inAttributes;
  inAttributes = value;
  return previous;
}

/**
 * Updates the state of being in a skip element.
 * @param value Whether or not the patch is skipping the children of a
 *    parent node.
 * @return the previous value.
 */
function setInSkip(value: boolean) {
  const previous = inSkip;
  inSkip = value;
  return previous;
}

export {
  assert,
  assertInPatch,
  assertNoUnclosedTags,
  assertNotInAttributes,
  assertInAttributes,
  assertCloseMatchesOpenTag,
  assertVirtualAttributesClosed,
  assertNoChildrenDeclaredYet,
  assertNotInSkip,
  assertPatchElementNoExtras,
  assertPatchOuterHasParentNode,
  setInAttributes,
  setInSkip,
  updatePatchContext
};
