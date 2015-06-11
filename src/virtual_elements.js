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

var alignWithDOM = require('./alignment').alignWithDOM;
var updateAttribute = require('./attributes').updateAttribute;
var getData = require('./node_data').getData;
var getWalker = require('./walker').getWalker;
var traversal = require('./traversal'),
    firstChild = traversal.firstChild,
    nextSibling = traversal.nextSibling,
    parentNode = traversal.parentNode;


/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 * @const
 */
var ATTRIBUTES_OFFSET = 3;


/**
 * Builds an array of arguments for use with ie_open_start, iattr and
 * ie_open_end.
 * @type {Array<*>}
 * @const
 */
var argsBuilder = [];


if (process.env.node_env === 'production') {
  /**
   * Keeps track whether or not we are in an attributes declaration (after
   * ie_open_start, but before ie_open_end).
   * @type {boolean}
   */
  var inAttributes = false;
}


/** Makes sure that the caller is not where attributes are expected. */
var assertNotInAttributes = function() {
  if (process.env.node_env === 'production' && inAttributes) {
    throw new Error('Was not expecting a call to iattr or ie_open_end, ' +
        'they must follow a call to ie_open_start.');
  }
};


/** Makes sure that the caller is where attributes are expected. */
var assertInAttributes = function() {
  if (process.env.node_env === 'production' && !inAttributes) {
    throw new Error('Was expecting a call to iattr or ie_open_end. ' +
        'ie_open_start must be followed by zero or more calls to iattr, ' +
        'then one call to ie_open_end.');
  }
};


/** Updates the state to being in an attribute declaration. */
var setInAttributes = function() {
  if (process.env.node_env === 'production') {
    inAttributes = true;
  }
};


/** Updates the state to not being in an attribute declaration. */
var setNotInAttributes = function() {
  if (process.env.node_env === 'production') {
    inAttributes = false;
  }
};


/**
 * Checks to see if one or more attributes have changed for a given
 * Element. When no attributes have changed, this function is much faster than
 * checking each individual argument. When attributes have changed, the overhead
 * of this function is minimal.
 *
 * This function is called in the context of the Element and the arguments from
 * ie_open-like function so that the arguments are not de-optimized.
 *
 * @this {Element} The Element to check for changed attributes.
 * @param {*} unused1
 * @param {*} unused2
 * @param {*} unused3
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {boolean} True if the Element has one or more changed attributes,
 *     false otherwise.
 */
var hasChangedAttrs = function(unused1, unused2, unused3, var_args) {
  var data = getData(this);
  var attrsArr = data.attrsArr;
  var attrsChanged = false;
  var i;

  for (i = ATTRIBUTES_OFFSET; i < arguments.length; i += 2) {
    // Translate the from the arguments index (for values) to the attribute's
    // ordinal. The attribute values are at arguments index 3, 5, 7, etc. To get
    // the ordinal, need to subtract the offset and divide by 2
    if (attrsArr[(i - ATTRIBUTES_OFFSET) >> 1] !== arguments[i + 1]) {
      attrsChanged = true;
      break;
    }
  }

  if (attrsChanged) {
    for (i = ATTRIBUTES_OFFSET; i < arguments.length; i += 2) {
      attrsArr[(i - ATTRIBUTES_OFFSET) >> 1] = arguments[i + 1];
    }
  }

  return attrsChanged;
};


/**
 * Updates the newAttrs object for an Element.
 *
 * This function is called in the context of the Element and the arguments from
 * ie_open-like function so that the arguments are not de-optimized.
 *
 * @this {Element} The Element to update newAttrs for.
 * @param {*} unused1
 * @param {*} unused2
 * @param {*} unused3
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Object<string, *>} The updated newAttrs object.
 */
var updateNewAttrs = function(unused1, unused2, unused3, var_args) {
  var node = this;
  var data = getData(node);
  var newAttrs = data.newAttrs;

  for (var attr in newAttrs) {
    newAttrs[attr] = undefined;
  }

  for (var i = ATTRIBUTES_OFFSET; i < arguments.length; i += 2) {
    newAttrs[arguments[i]] = arguments[i + 1];
  }

  return newAttrs;
};


/**
 * Updates the attributes for a given Element.
 * @param {!Element} node
 * @param {!Object<string,*>} newAttrs The new attributes for node
 */
var updateAttributes = function(node, newAttrs) {
  for (var attr in newAttrs) {
    updateAttribute(node, attr, newAttrs[attr]);
  }
};


/**
 * Declares a virtual Element at the current location in the document. This
 * corresponds to an opening tag and a ie_close tag is required.
 * @param {string} tag The element's tag.
 * @param {?string} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 */
var ie_open = function(tag, key, statics, var_args) {
  assertNotInAttributes();

  var node = alignWithDOM(tag, key, statics);

  if (hasChangedAttrs.apply(node, arguments)) {
    var newAttrs = updateNewAttrs.apply(node, arguments);
    updateAttributes(node, newAttrs);
  }

  firstChild();
};


/**
 * Declares a virtual Element at the current location in the document. This
 * corresponds to an opening tag and a ie_close tag is required. This is like
 * ie_open, but the attributes are defined using the iattr function rather than
 * being passed as arguments. Must be folllowed by 0 or more calls to iattr,
 * then a call to ie_open_end.
 * @param {string} tag The element's tag.
 * @param {?string} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 */
var ie_open_start = function(tag, key, statics) {
  assertNotInAttributes();
  setInAttributes();

  argsBuilder[0] = tag;
  argsBuilder[1] = key;
  argsBuilder[2] = statics;
  argsBuilder.length = ATTRIBUTES_OFFSET;
};


/***
 * Defines a virtual attribute at this point of the DOM. This is only valid
 * when called between ie_open_start and ie_open_end.
 *
 * @param {string} name
 * @param {*} value
 */
var iattr = function(name, value) {
  assertInAttributes();

  argsBuilder.push(name, value);
};


/**
 * Closes an open tag started with ie_open_start.
 */
var ie_open_end = function() {
  assertInAttributes();
  setNotInAttributes();

  ie_open.apply(null, argsBuilder);
};


/**
 * Closes an open virtual Element.
 *
 * @param {string} tag The element's tag.
 */
var ie_close = function(tag) {
  assertNotInAttributes();

  parentNode();
  nextSibling();
};


/**
 * Declares a virtual Element at the current location in the document that has
 * no children.
 * @param {string} tag The element's tag.
 * @param {?string} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 */
var ie_void = function(tag, key, statics, var_args) {
  assertNotInAttributes();

  ie_open.apply(null, arguments);
  ie_close.apply(null, arguments);
};


/**
 * Declares a virtual TextNode at this point in the document.
 *
 * @param {string} value The text of the TextNode.
 */
var itext = function(value) {
  assertNotInAttributes();

  var node = alignWithDOM(undefined, undefined, value);

  if (node['__incrementalDOMText'] !== value) {
    node.data = value;
    node['__incrementalDOMText'] = value;
  }

  nextSibling();
};


/** */
module.exports = {
  ie_open_start: ie_open_start,
  ie_open_end: ie_open_end,
  ie_open: ie_open,
  ie_void: ie_void,
  ie_close: ie_close,
  itext: itext,
  iattr: iattr
};

