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

var getData = require('./node_data').getData;


var CUSTOM_ATTRIBUTE_REGEX = /^(data|aria)-[a-z_][a-z\d_.\-]*$/;


/**
 * Applies an attribute to a given Element. If the value is undefined or null,
 * it is removed from the Element.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value.
 */
var applyAttr = function(el, name, value) {
  var data = getData(el);
  var attrs = data.attrs;

  if (attrs[name] === value) {
    return;
  }

  if (value == null) {
    el.removeAttribute(name);
  } else {
    el.setAttribute(name, value);
  }

  attrs[name] = value;
};

/**
 * Applies an property to a given Element.
 * @param {!Element} el
 * @param {string} name The property's name.
 * @param {*} value The property's value.
 */
var applyProp = function(el, name, value) {
  var data = getData(el);
  var attrs = data.attrs;

  if (attrs[name] === value) {
    return;
  }

  el[name] = value;
  attrs[name] = value;
};


/**
 * Applies a style to an Element. No vendor prefix expansion is done for
 * property names/values.
 * @param {!Element} el
 * @param {*} unused1
 * @param {string|Object<string,string>} style The style to set. Either a string
 *     of css or an object containing property-value pairs.
 */
var applyStyle = function(el, unused1, style) {
  if (typeof style === 'string' || style instanceof String) {
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
 * @param {*} value The attribute's value. If the value is a string, it is set
 *     as an HTML attribute, otherwise, it is set on node.
 */
var updateAttribute = function(el, name, value) {
  var setter = hooks[name];
  if (!setter) {
    if (isCustomAttribute(name)) {
      setter = applyAttr;
    } else {
      setter = applyProp;
    }
  }

  setter(el, name, value);
};

var isCustomAttribute = function(attribute) {
  return CUSTOM_ATTRIBUTE_REGEX.test(attribute);
};

var hooks = {
  allowFullScreen: applyAttr,
  allowTransparency: applyAttr,
  capture: applyAttr,
  challenge: applyAttr,
  charSet: applyAttr,
  'class': applyAttr,
  classID: applyAttr,
  cols: applyAttr,
  contextMenu: applyAttr,
  dateTime: applyAttr,
  disabled: applyAttr,
  form: applyAttr,
  formAction: applyAttr,
  formEncType: applyAttr,
  formMethod: applyAttr,
  formTarget: applyAttr,
  frameBorder: applyAttr,
  height: applyAttr,
  hidden: applyAttr,
  inputMode: applyAttr,
  is: applyAttr,
  itemID: applyAttr,
  itemProp: applyAttr,
  itemRef: applyAttr,
  itemScope: applyAttr,
  itemType: applyAttr,
  keyParams: applyAttr,
  keyType: applyAttr,
  list: applyAttr,
  manifest: applyAttr,
  maxLength: applyAttr,
  media: applyAttr,
  minLength: applyAttr,
  role: applyAttr,
  rows: applyAttr,
  seamless: applyAttr,
  security: applyAttr,
  size: applyAttr,
  sizes: applyAttr,
  srcSet: applyAttr,
  tabindex: applyAttr,
  unselectable: applyAttr,
  width: applyAttr,
  wmode: applyAttr,

  // Special case style attribute
  style: applyStyle
};


/** */
module.exports = {
  updateAttribute: updateAttribute,
  hooks: hooks
};

