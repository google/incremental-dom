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

import {AttrMutatorConfig} from './types';
import {assert} from './assertions';
import {createMap, has} from './util';
import {symbols} from './symbols';


/**
 * Returns the namespace to use for the attribute.
 */
function getNamespace(name: string): string|undefined {
  if (name.lastIndexOf('xml:', 0) === 0) {
    return 'http://www.w3.org/XML/1998/namespace';
  }

  if (name.lastIndexOf('xlink:', 0) === 0) {
    return 'http://www.w3.org/1999/xlink';
  }

  return undefined;
}


/**
 * Applies an attribute or property to a given Element. If the value is null
 * or undefined, it is removed from the Element. Otherwise, the value is set
 * as an attribute.
 */
function applyAttr(el: Element, name: string, value: unknown) {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    const attrNS = getNamespace(name);
    if (attrNS) {
      el.setAttributeNS(attrNS, name, String(value));
    } else {
      el.setAttribute(name, String(value));
    }
  }
}

/**
 * Applies a property to a given Element.
 */
function applyProp(el: Element, name: string, value: unknown) {
  // tslint:disable-next-line:no-any
  (el as any)[name] = value;
}


/**
 * Applies a value to a style declaration. Supports CSS custom properties by
 * setting properties containing a dash using CSSStyleDeclaration.setProperty.
 */
function setStyleValue(
    style: CSSStyleDeclaration, prop: string, value: string) {
  if (prop.indexOf('-') >= 0) {
    style.setProperty(prop, value);
  } else {
    // TODO(tomnguyen) Figure out why this is necessary.
    // tslint:disable-next-line:no-any
    (style as any)[prop] = value;
  }
}


/**
 * Applies a style to an Element. No vendor prefix expansion is done for
 * property names/values.
 * @param el
 * @param name The attribute's name.
 * @param  style The style to set. Either a string of css or an object
 *     containing property-value pairs.
 */
function applyStyle(
    el: Element, name: string, style: string|{[k: string]: string}) {
  // MathML elements inherit from Element, which does not have style.
  assert(el instanceof HTMLElement || el instanceof SVGElement);
  const elStyle = (<HTMLElement|SVGElement>el).style;

  if (typeof style === 'string') {
    elStyle.cssText = style;
  } else {
    elStyle.cssText = '';

    for (const prop in style) {
      if (has(style, prop)) {
        setStyleValue(elStyle, prop, style[prop]);
      }
    }
  }
}


/**
 * Updates a single attribute on an Element.
 * @param el
 * @param name The attribute's name.
 * @param value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 */
function applyAttributeTyped(el: Element, name: string, value: unknown) {
  const type = typeof value;

  if (type === 'object' || type === 'function') {
    applyProp(el, name, value);
  } else {
    applyAttr(el, name, value);
  }
}

/**
 * A publicly mutable object to provide custom mutators for attributes.
 * NB: The result of createMap() has to be recast since closure compiler
 * will just assume attributes is "any" otherwise and throws away
 * the type annotation set by tsickle.
 */
const attributes: AttrMutatorConfig = (createMap() as AttrMutatorConfig);

// Special generic mutator that's called for any attribute that does not
// have a specific mutator.
attributes[symbols.default] = applyAttributeTyped;

attributes['style'] = applyStyle;

/**
 * Calls the appropriate attribute mutator for this attribute.
 */
function updateAttribute(el: Element, name: string, value: unknown) {
  const mutator = attributes[name] || attributes[symbols.default];
  mutator(el, name, value);
}



export {
  updateAttribute,
  applyProp,
  applyAttr,
  attributes,
};
