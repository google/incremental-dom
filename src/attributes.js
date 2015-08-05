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


var attributes = {
  /**
   * Applies an attribute or property to a given Element. If the value is a
   * object or a function (which includes null), it is set as a property on the
   * Element. Otherwise, the value is set as an attribute.
   * @param {!Element} el
   * @param {string} name The attribute's name.
   * @param {*} value The attribute's value. If the value is a string, it is set
   *     as an HTML attribute, otherwise, it is set on node.
   */
  applyAttr: function(el, name, value) {
    var type = typeof value;

    if (type === 'object' || type === 'function') {
      el[name] = value;
    } else if (value === undefined) {
      el.removeAttribute(name);
    } else {
      el.setAttribute(name, value);
    }
  },


  /**
   * Applies a style to an Element. No vendor prefix expansion is done for
   * property names/values.
   * @param {!Element} el
   * @param {string|Object<string,string>} style The style to set. Either a
   *     string of css or an object containing property-value pairs.
   */
  applyStyle: function(el, style) {
    if (typeof style === 'string') {
      el.style.cssText = style;
    } else {
      el.style.cssText = '';

      for (var prop in style) {
        el.style[prop] = style[prop];
      }
    }
  },


  /**
   * Updates a single attribute on an Element.
   * @param {!Element} el
   * @param {string} name The attribute's name.
   * @param {*} value The attribute's value. If the value is a string, it is set
   *     as an HTML attribute, otherwise, it is set on node.
   */
  updateAttribute: function(el, name, value) {
    var attrs = el['__incrementalDOMAttrs'];

    if (attrs[name] === value) {
      return;
    }

    if (name === 'style') {
      attributes.applyStyle(el, value);
    } else {
      attributes.applyAttr(el, name, value);
    }

    attrs[name] = value;
  }
};


/** */
export {
  attributes
};

