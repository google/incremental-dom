/** @license SPDX-License-Identifier: Apache-2.0 */
import { AttrMutatorConfig, Key, NameOrCtorDef, Statics } from "./types";
/**
 * Declares a virtual Element at the current location in the document. This
 * corresponds to an opening tag and a elementClose tag is required. This is
 * like elementOpen, but the attributes are defined using the attr function
 * rather than being passed as arguments. Must be folllowed by 0 or more calls
 * to attr, then a call to elementOpenEnd.
 * @param nameOrCtor The Element's tag or constructor.
 * @param key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param statics An array of attribute name/value pairs of the static
 *     attributes for the Element. Attributes will only be set once when the
 *     Element is created.
 */
declare function elementOpenStart(nameOrCtor: NameOrCtorDef, key?: Key, statics?: Statics): void;
/**
 * Allows you to define a key after an elementOpenStart. This is useful in
 * templates that define key after an element has been opened ie
 * `<div key('foo')></div>`.
 * @param key The key to use for the next call.
 */
declare function key(key: string): void;
/**
 * Buffers an attribute, which will get applied during the next call to
 * `elementOpen`, `elementOpenEnd` or `applyAttrs`.
 * @param name The of the attribute to buffer.
 * @param value The value of the attribute to buffer.
 */
declare function attr(name: string, value: any): void;
/**
 * Closes an open tag started with elementOpenStart.
 * @return The corresponding Element.
 */
declare function elementOpenEnd(): HTMLElement;
/**
 * @param  nameOrCtor The Element's tag or constructor.
 * @param  key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param statics An array of attribute name/value pairs of the static
 *     attributes for the Element. Attributes will only be set once when the
 *     Element is created.
 * @param varArgs, Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return The corresponding Element.
 */
declare function elementOpen(nameOrCtor: NameOrCtorDef, key?: Key, statics?: Statics, ...varArgs: Array<any>): HTMLElement;
/**
 * Applies the currently buffered attrs to the currently open element. This
 * clears the buffered attributes.
 * @param attrs The attributes.
 */
declare function applyAttrs(attrs?: AttrMutatorConfig): void;
/**
 * Applies the current static attributes to the currently open element. Note:
 * statics should be applied before calling `applyAtrs`.
 * @param statics The statics to apply to the current element.
 * @param attrs The attributes.
 */
declare function applyStatics(statics: Statics, attrs?: AttrMutatorConfig): void;
/**
 * Closes an open virtual Element.
 *
 * @param nameOrCtor The Element's tag or constructor.
 * @return The corresponding Element.
 */
declare function elementClose(nameOrCtor: NameOrCtorDef): Element;
/**
 * Declares a virtual Element at the current location in the document that has
 * no children.
 * @param nameOrCtor The Element's tag or constructor.
 * @param key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param statics An array of attribute name/value pairs of the static
 *     attributes for the Element. Attributes will only be set once when the
 *     Element is created.
 * @param varArgs Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return The corresponding Element.
 */
declare function elementVoid(nameOrCtor: NameOrCtorDef, key?: Key, statics?: Statics, ...varArgs: Array<any>): Element;
/**
 * Declares a virtual Text at this point in the document.
 *
 * @param value The value of the Text.
 * @param varArgs
 *     Functions to format the value which are called only when the value has
 *     changed.
 * @return The corresponding text node.
 */
declare function text(value: string | number | boolean, ...varArgs: Array<(a: {}) => string>): Text;
/** */
export { applyAttrs, applyStatics, elementOpenStart, elementOpenEnd, elementOpen, elementVoid, elementClose, text, attr, key };
