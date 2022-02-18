/** @license SPDX-License-Identifier: Apache-2.0 */
import { NameOrCtorDef } from "./types";
/**
 * Asserts that a value exists and is not null or undefined. goog.asserts
 * is not used in order to avoid dependencies on external code.
 * @param val The value to assert is truthy.
 * @returns The value.
 */
declare function assert<T extends {}>(val: T | null | undefined): T;
/**
 * Makes sure that there is a current patch context.
 * @param functionName The name of the caller, for the error message.
 */
declare function assertInPatch(functionName: string): void;
/**
 * Makes sure that a patch closes every node that it opened.
 * @param openElement
 * @param root
 */
declare function assertNoUnclosedTags(openElement: Node | null, root: Node | DocumentFragment): void;
/**
 * Makes sure that node being outer patched has a parent node.
 * @param parent
 */
declare function assertPatchOuterHasParentNode(parent: Node | null): void;
/**
 * Makes sure that the caller is not where attributes are expected.
 * @param functionName The name of the caller, for the error message.
 */
declare function assertNotInAttributes(functionName: string): void;
/**
 * Makes sure that the caller is not inside an element that has declared skip.
 * @param functionName The name of the caller, for the error message.
 */
declare function assertNotInSkip(functionName: string): void;
/**
 * Makes sure that the caller is where attributes are expected.
 * @param functionName The name of the caller, for the error message.
 */
declare function assertInAttributes(functionName: string): void;
/**
 * Makes sure the patch closes virtual attributes call
 */
declare function assertVirtualAttributesClosed(): void;
/**
 * Makes sure that tags are correctly nested.
 * @param currentNameOrCtor
 * @param nameOrCtor
 */
declare function assertCloseMatchesOpenTag(currentNameOrCtor: NameOrCtorDef, nameOrCtor: NameOrCtorDef): void;
/**
 * Makes sure that no children elements have been declared yet in the current
 * element.
 * @param functionName The name of the caller, for the error message.
 * @param previousNode
 */
declare function assertNoChildrenDeclaredYet(functionName: string, previousNode: Node | null): void;
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
declare function assertPatchElementNoExtras(maybeStartNode: Node | null, maybeCurrentNode: Node | null, expectedNextNode: Node | null, expectedPrevNode: Node | null): void;
/**
 * @param newContext The current patch context.
 */
declare function updatePatchContext(newContext: {} | null): void;
/**
 * Updates the state of being in an attribute declaration.
 * @param value Whether or not the patch is in an attribute declaration.
 * @return the previous value.
 */
declare function setInAttributes(value: boolean): boolean;
/**
 * Updates the state of being in a skip element.
 * @param value Whether or not the patch is skipping the children of a
 *    parent node.
 * @return the previous value.
 */
declare function setInSkip(value: boolean): boolean;
export { assert, assertInPatch, assertNoUnclosedTags, assertNotInAttributes, assertInAttributes, assertCloseMatchesOpenTag, assertVirtualAttributesClosed, assertNoChildrenDeclaredYet, assertNotInSkip, assertPatchElementNoExtras, assertPatchOuterHasParentNode, setInAttributes, setInSkip, updatePatchContext };
