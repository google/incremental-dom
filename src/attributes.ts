//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import { AttrMutatorConfig } from "./types";
import { assert } from "./assertions";
import { createMap, has } from "./util";
import { symbols } from "./symbols";

/**
 * @param name The name of the attribute. For example "tabindex" or
 *    "xlink:href".
 * @returns The namespace to use for the attribute, or null if there is
 * no namespace.
 */
function getNamespace(name: string): string | null {
  if (name.lastIndexOf("xml:", 0) === 0) {
    return "http://www.w3.org/XML/1998/namespace";
  }

  if (name.lastIndexOf("xlink:", 0) === 0) {
    return "http://www.w3.org/1999/xlink";
  }

  return null;
}

/**
 * Applies an attribute or property to a given Element. If the value is null
 * or undefined, it is removed from the Element. Otherwise, the value is set
 * as an attribute.
 * @param el The element to apply the attribute to.
 * @param name The attribute's name.
 * @param value The attribute's value.
 */
function applyAttr(el: Element, name: string, value: unknown) {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    const attrNS = getNamespace(name);
    if (attrNS) {
      el.setAttributeNS(attrNS, name, value as string);
    } else {
      el.setAttribute(name, value as string);
    }
  }
}

/**
 * Applies a property to a given Element.
 * @param el The element to apply the property to.
 * @param name The property's name.
 * @param value The property's value.
 */
function applyProp(el: Element, name: string, value: unknown) {
  (el as any)[name] = value;
}

/**
 * Applies a value to a style declaration. Supports CSS custom properties by
 * setting properties containing a dash using CSSStyleDeclaration.setProperty.
 * @param style A style declaration.
 * @param prop The property to apply. This can be either camelcase or dash
 *    separated. For example: "backgroundColor" and "background-color" are both
 *    supported.
 * @param value The value of the property.
 */
function setStyleValue(
  style: CSSStyleDeclaration,
  prop: string,
  value: string
) {
  if (prop.indexOf("-") >= 0) {
    style.setProperty(prop, value);
  } else {
    (style as any)[prop] = value;
  }
}

/**
 * Applies a style to an Element. No vendor prefix expansion is done for
 * property names/values.
 * @param el The Element to apply the style for.
 * @param name The attribute's name.
 * @param  style The style to set. Either a string of css or an object
 *     containing property-value pairs.
 */
function applyStyle(
  el: Element,
  name: string,
  style: string | { [k: string]: string }
) {
  // MathML elements inherit from Element, which does not have style. We cannot
  // do `instanceof HTMLElement` / `instanceof SVGElement`, since el can belong
  // to a different document, so just check that it has a style.
  assert("style" in el);
  const elStyle = (<HTMLElement | SVGElement>el).style;

  if (typeof style === "string") {
    elStyle.cssText = style;
  } else {
    elStyle.cssText = "";

    for (const prop in style) {
      if (has(style, prop)) {
        setStyleValue(elStyle, prop, style[prop]);
      }
    }
  }
}

/**
 * Updates a single attribute on an Element.
 * @param el The Element to apply the attribute to.
 * @param name The attribute's name.
 * @param value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 */
function applyAttributeTyped(el: Element, name: string, value: unknown) {
  const type = typeof value;

  if (type === "object" || type === "function") {
    applyProp(el, name, value);
  } else {
    applyAttr(el, name, value);
  }
}

function createAttributeMap() {
  const attributes: AttrMutatorConfig = createMap() as AttrMutatorConfig;
  // Special generic mutator that's called for any attribute that does not
  // have a specific mutator.
  attributes[symbols.default] = applyAttributeTyped;

  attributes["style"] = applyStyle;
  return attributes;
}

/**
 * A publicly mutable object to provide custom mutators for attributes.
 * NB: The result of createMap() has to be recast since closure compiler
 * will just assume attributes is "any" otherwise and throws away
 * the type annotation set by tsickle.
 */
const attributes = createAttributeMap();

/**
 * Calls the appropriate attribute mutator for this attribute.
 * @param el The Element to apply the attribute to.
 * @param name The attribute's name.
 * @param value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 * @param attrs The attribute map of mutators.
 */
function updateAttribute(
  el: Element,
  name: string,
  value: unknown,
  attrs: AttrMutatorConfig
) {
  const mutator = attrs[name] || attrs[symbols.default];
  mutator(el, name, value);
}

export {
  createAttributeMap,
  updateAttribute,
  applyProp,
  applyAttr,
  attributes
};
