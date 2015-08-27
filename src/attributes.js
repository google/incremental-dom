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

import { getData } from './node_data';


/**
 * Applies an attribute or property to a given Element. If the value is null
 * or undefined, it is removed from the Element. Otherwise, the value is set
 * as an attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {?(boolean|number|string)=} value The attribute's value.
 */
var applyAttr = function(el, name, value) {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    el.setAttribute(name, value);
  }
};

/**
 * Applies a property to a given Element.
 * @param {!Element} el
 * @param {string} name The property's name.
 * @param {*} value The property's value.
 */
var applyProp = function(el, name, value) {
  el[name] = value;
};


/**
 * Applies a style to an Element. No vendor prefix expansion is done for
 * property names/values.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {string|Object<string,string>} style The style to set. Either a
 *     string of css or an object containing property-value pairs.
 */
var applyStyle = function(el, name, style) {
  if (typeof style === 'string') {
    el.style.cssText = style;
  } else {
    el.style.cssText = '';

    for (var prop in style) {
      el.style[prop] = style[prop];
    }
  }
};


/**
 * Updates a single attribute on an Element.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 */
var applyAttributeTyped = function(el, name, value) {
  var type = typeof value;

  if (type === 'object' || type === 'function') {
    applyProp(el, name, value);
  } else {
    applyAttr(el, name, /** @type {?(boolean|number|string)} */(value));
  }
};


/**
 * Calls the appropriate attribute mutator for this attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*=} value The attribute's value.
 */
var updateAttribute = function(el, name, value) {
  var mutator = mutators[name] || mutators.__all;
  mutator(el, name, value);
};


/**
 * Mirrors the attributes on an Element to the passed in attributes.
 * @param {!Element} el
 * @param {?Object<string, *>=} attributes An object of attribute name/value
 *     pairs of the dynamic attributes for the Element.
 */
var updateAttributes = function(el, attributes) {
  var data = getData(el);
  var attrs = data.attrs;
  var attr;

  for (attr in attrs) {
    if (!(attributes && attr in attributes)) {
      updateAttribute(el, attr);
      delete attrs[attr];
    }
  }

  for (attr in attributes) {
    var value = attributes[attr];

    if (attrs[attr] !== value) {
      updateAttribute(el, attr, value);
      attrs[attr] = value;
    }
  }
};


/**
 * Exposes our default attribute mutators publicly, so they may be used in
 * custom mutators.
 * @const {!Object<string, function(!Element, string, *)>}
 */
var defaults = {
  applyAttr: applyAttr,
  applyProp: applyProp,
  applyStyle: applyStyle
};


/**
 * A publicly mutable object to provide custom mutators for attributes.
 * @const {!Object<string, function(!Element, string, *)>}
 */
var mutators = {
  // Special generic mutator that's called for any attribute that does not
  // have a specific mutator.
  __all: applyAttributeTyped,

  // Special case the style attribute
  'style': applyStyle
};


/** */
export {
  updateAttributes,
  updateAttribute,
  defaults,
  mutators
};
