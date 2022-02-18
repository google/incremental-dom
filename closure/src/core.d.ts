/** @license SPDX-License-Identifier: Apache-2.0 */
import { Context } from "./context";
import { Key, NameOrCtorDef, PatchConfig, PatchFunction } from "./types";
/**
 * TODO(sparhami) We should just export argsBuilder directly when Closure
 * Compiler supports ES6 directly.
 * @returns The Array used for building arguments.
 */
declare function getArgsBuilder(): Array<any>;
/**
 * TODO(sparhami) We should just export attrsBuilder directly when Closure
 * Compiler supports ES6 directly.
 * @returns The Array used for building arguments.
 */
declare function getAttrsBuilder(): Array<any>;
/**
 * Updates the internal structure of a DOM node in the case that an external
 * framework tries to modify a DOM element.
 * @param el The DOM node to update.
 */
declare function alwaysDiffAttributes(el: Element): void;
/**
 * Changes to the next sibling of the current node.
 */
declare function nextNode(): void;
/**
 * Aligns the virtual Node definition with the actual DOM, moving the
 * corresponding DOM node to the correct location or creating it if necessary.
 * @param nameOrCtor The name or constructor for the Node.
 * @param key The key used to identify the Node.
 * @param nonce The nonce attribute for the element.
 */
declare function alignWithDOM(nameOrCtor: NameOrCtorDef, key: Key, nonce?: string): void;
/**
 * Makes sure that the current node is an Element with a matching nameOrCtor and
 * key.
 *
 * @param nameOrCtor The tag or constructor for the Element.
 * @param key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param nonce The nonce attribute for the element.
 * @return The corresponding Element.
 */
declare function open(nameOrCtor: NameOrCtorDef, key?: Key, nonce?: string): HTMLElement;
/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 * @returns The Element that was just closed.
 */
declare function close(): Element;
/**
 * Makes sure the current node is a Text node and creates a Text node if it is
 * not.
 * @returns The Text node that was aligned or created.
 */
declare function text(): Text;
/**
 * @returns The current Element being patched.
 */
declare function currentElement(): Element;
/**
 * @returns The current Element being patched, or null if no patch is in progress.
 */
declare function tryGetCurrentElement(): Element | null;
/**
 * @return The Node that will be evaluated for the next instruction.
 */
declare function currentPointer(): Node;
declare function currentContext(): Context | null;
/**
 * Skips the children in a subtree, allowing an Element to be closed without
 * clearing out the children.
 */
declare function skip(): void;
/**
 * Creates a patcher that patches the document starting at node with a
 * provided function. This function may be called during an existing patch operation.
 * @param patchConfig The config to use for the patch.
 * @returns The created function for patching an Element's children.
 */
declare function createPatchInner<T>(patchConfig?: PatchConfig): PatchFunction<T, Node>;
/**
 * Creates a patcher that patches an Element with the the provided function.
 * Exactly one top level element call should be made corresponding to `node`.
 * @param patchConfig The config to use for the patch.
 * @returns The created function for patching an Element.
 */
declare function createPatchOuter<T>(patchConfig?: PatchConfig): PatchFunction<T, Node | null>;
declare const patchInner: <T>(node: Element | DocumentFragment, template: (a: T | undefined) => void, data?: T | undefined) => Node;
declare const patchOuter: <T>(node: Element | DocumentFragment, template: (a: T | undefined) => void, data?: T | undefined) => Node | null;
export { alignWithDOM, alwaysDiffAttributes, getArgsBuilder, getAttrsBuilder, text, createPatchInner, createPatchOuter, patchInner, patchOuter, open, close, currentElement, currentContext, currentPointer, skip, nextNode as skipNode, tryGetCurrentElement };
