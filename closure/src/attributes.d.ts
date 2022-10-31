/** @license SPDX-License-Identifier: Apache-2.0 */
import { AttrMutatorConfig } from "./types";
/**
 * Applies an attribute or property to a given Element. If the value is null
 * or undefined, it is removed from the Element. Otherwise, the value is set
 * as an attribute.
 * @param el The element to apply the attribute to.
 * @param name The attribute's name.
 * @param value The attribute's value.
 */
declare function applyAttr(el: Element, name: string, value: unknown): void;
/**
 * Applies a property to a given Element.
 * @param el The element to apply the property to.
 * @param name The property's name.
 * @param value The property's value.
 */
declare function applyProp(el: Element, name: string, value: unknown): void;
declare function createAttributeMap(): AttrMutatorConfig;
/**
 * A publicly mutable object to provide custom mutators for attributes.
 * NB: The result of createMap() has to be recast since closure compiler
 * will just assume attributes is "any" otherwise and throws away
 * the type annotation set by tsickle.
 */
declare const attributes: AttrMutatorConfig;
/**
 * Calls the appropriate attribute mutator for this attribute.
 * @param el The Element to apply the attribute to.
 * @param name The attribute's name.
 * @param value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 * @param attrs The attribute map of mutators.
 */
declare function updateAttribute(el: Element, name: string, value: unknown, attrs: AttrMutatorConfig): void;
export { createAttributeMap, updateAttribute, applyProp, applyAttr, attributes };
