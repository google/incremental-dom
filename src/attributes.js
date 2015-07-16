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

var nodeData = require('./node_data'),
    getAttrsArr = nodeData.getAttrsArr,
    getNewAttrs = nodeData.getNewAttrs,
    getAttrs = nodeData.getAttrs;


/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 * @const {number}
 */
var ATTRIBUTES_OFFSET_INTERNAL = 3;


/**
 * The offset in the update attributes call where the attributes are specified.
 * @const {number}
 */
var ATTRIBUTES_OFFSET_EXTERNAL = 1;


/**
 * Verify if the script is running in production.
 * @type {boolean}
 * @const
 */
var IS_PRODUCTION = process.env.NODE_ENV === 'production';


/**
 * The start index of attribute name/value pairs in the arguments of the
 * current call to changedAttributes.
 * {number}
 */
var changedAttributesStartIndex;


if (!IS_PRODUCTION) {
  /**
   * Makes sure that updateAttributes and updateAttributesInternal have matched
   * sets of attribute name/value pairs.
   */
  var assertMatchedPairs = function(startIndex, argsLength) {
    var total = argsLength - startIndex;

    if (total > startIndex && total % 2 === 1) {
      throw new Error('Was expecting matched pairs of attribute names and values.');
    }
  };
}


/**
 * Applies an attribute or property to a given Element. If the value is a object
 * or a function (which includes null), it is set as a property on the Element.
 * Otherwise, the value is set as an attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value. If the value is a string, it is set
 *     as an HTML attribute, otherwise, it is set on node.
 */
var applyAttr = function(el, name, value) {
  var attrs = getAttrs(el);

  if (attrs[name] === value) {
    return;
  }

  var type = typeof value;

  if (value === undefined) {
    el.removeAttribute(name);
  } else if (type === 'object' || type === 'function') {
    el[name] = value;
  } else {
    el.setAttribute(name, value);
  }

  attrs[name] = value;
};


/**
 * Applies a style to an Element. No vendor prefix expansion is done for
 * property names/values.
 * @param {!Element} el
 * @param {string|Object<string,string>} style The style to set. Either a string
 *     of css or an object containing property-value pairs.
 */
var applyStyle = function(el, style) {
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
 * Checks to see if one or more attributes have changed for a given
 * Element. When no attributes have changed, this function is much faster than
 * checking each individual argument. When attributes have changed, the overhead
 * of this function is minimal.
 *
 * Depending on the source of the call, the index of the first attribute will
 * change.
 *
 * This function is called in the context of the Element and the arguments from
 * elementOpen-like function so that the arguments are not de-optimized.
 *
 * @this {Element} The Element to check for changed attributes.
 * @param {*} unused1
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {?Array<*>} The changed attributes, if any have changed.
 */
var changedAttributes = function(unused1, var_args) {
  var attrsArr = getAttrsArr(this);
  var attrsChanged = false;
  var i = changedAttributesStartIndex;
  var j = 0;

  for (; i < arguments.length; i += 1, j += 1) {
    if (attrsArr[j] !== arguments[i]) {
      attrsChanged = true;
      break;
    }
  }

  for (; i < arguments.length; i += 1, j += 1) {
    attrsArr[j] = arguments[i];
  }

  if (j < attrsArr.length) {
    attrsChanged = true;
    attrsArr.length = j;
  }

  if (attrsChanged) {
    return attrsArr;
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
  if (name === 'style') {
    applyStyle(el, value);
  } else {
    applyAttr(el, name, value);
  }
};


/**
 * Sets static attributes on an Element.
 * @param {!Element} el
 * @param {?Array<*>} attributes An array of attribute name/value pairs of
 *     the static attributes for the Element.
 */
var staticAttributes = function(el, attributes) {
  if (!IS_PRODUCTION) {
    assertMatchedPairs(0, attributes.length);
  }

  for (var i = 0; i < attributes.length; i += 2) {
    updateAttribute(el, attributes[i], attributes[i + 1]);
  }
};


/**
 * Updates the newAttrs object for an Element.
 * @param {!Element} el
 * @param {?Array<*>} attributes An array of attribute name/value pairs of
 *     the static attributes for the Element.
 * @return {!Object<string, *>} The updated newAttrs object.
 */
var updateNewAttrs = function(el, attributes) {
  var newAttrs = getNewAttrs(el);

  for (var attr in newAttrs) {
    newAttrs[attr] = undefined;
  }

  for (var i = 0; i < attributes.length; i += 2) {
    newAttrs[attributes[i]] = attributes[i + 1];
  }

  return newAttrs;
};


/**
 * Updates changed attributes on an Element.
 * @param {!Element} el
 * @param {?Array<*>} attributes An array of attribute name/value pairs of
 *     the static attributes for the Element.
 */
var updateChangedAttributes = function(el, attributes) {
  var newAttrs = updateNewAttrs(el, attributes);

  for (var attr in newAttrs) {
    updateAttribute(el, attr, newAttrs[attr]);
  }
};


/**
 * Updates the attributes for an Element.
 *
 * This function is exposed externally, with attribute name/value pairs starting
 * at argument index 1, so it primes changedAttributes to the external method
 * signature.
 *
 * @param {Element} el The Element to update attributes for.
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 */
var updateAttributes = function(el, var_args) {
  if (!IS_PRODUCTION) {
    assertMatchedPairs(ATTRIBUTES_OFFSET_EXTERNAL, arguments.length);
  }

  changedAttributesStartIndex = ATTRIBUTES_OFFSET_EXTERNAL;

  var changed = changedAttributes.apply(el, arguments);
  if (changed) {
    updateChangedAttributes(el, changed);
  }
};

/**
 * Updates the attributes for an Element.
 *
 * This function is only exposed internally, with attribute name/value pairs
 * starting at argument index 3, so it primes changedAttributes to the internal
 * method signature.
 *
 * This function is called in the context of the Element and the arguments from
 * elementOpen-like function so that the arguments are not de-optimized.
 *
 * @this {Element} The Element to check for changed attributes.
 * @param {*} unused1
 * @param {*} unused2
 * @param {*} unused3
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 */
var updateAttributesInternal = function(unused1, unused2, unused3, var_args) {
  if (!IS_PRODUCTION) {
    assertMatchedPairs(ATTRIBUTES_OFFSET_INTERNAL, arguments.length);
  }

  changedAttributesStartIndex = ATTRIBUTES_OFFSET_INTERNAL;

  var changed = changedAttributes.apply(this, arguments);
  if (changed) {
    updateChangedAttributes(this, changed);
  }
};



/** */
module.exports = {
  staticAttributes: staticAttributes,
  updateAttributes: updateAttributes,
  updateAttributesInternal: updateAttributesInternal,
};

