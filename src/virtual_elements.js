/**
 * @license
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
 */
var ATTRIBUTES_OFFSET = 3;


var argsBuilder = [];


var hasChangedAttrs = function() {
  var data = getData(this);
  var attrsArr = data.attrsArr;
  var attrsChanged = false;  
  var i;

  for (i=ATTRIBUTES_OFFSET; i<arguments.length; i+=2) {
    if (attrsArr[(i - ATTRIBUTES_OFFSET) >> 1] !== arguments[i+1]) {
      attrsChanged = true;
      break;
    }
  }

  if (attrsChanged) {
    for (i=ATTRIBUTES_OFFSET; i<arguments.length; i+=2) {
      attrsArr[(i - ATTRIBUTES_OFFSET) >> 1] = arguments[i+1];
    }
  }

  return attrsChanged;
};


var updateNewAttrs = function() {
  var node = this;
  var data = getData(node);
  var newAttrs = data.newAttrs;
 
  for (var attr in newAttrs) {
    newAttrs[attr] = undefined;
  }

  for (var i=ATTRIBUTES_OFFSET; i<arguments.length; i+=2) {
    newAttrs[arguments[i]] = arguments[i+1];
  }

  return newAttrs;
};


var updateAttributes = function(node, newAttrs) {
  for (var attr in newAttrs) {
    updateAttribute(node, attr, newAttrs[attr]);
  }
};


/**
 * Declares a virtual element at the current location in the document. This
 * corresponds to an opening tag and a ie_close tag is required.
 *
 * @param {string} tag
 *   The element's tag name.
 * @param {string} key
 *   The key used to identify this element. This can be an empty string, but
 *   performance may be better if a unique value is used when iterating over
 *   an array of items.
 * @param {Array} statics
 *   Pairs of attributes and their values. This should be used for attributes
 *   that will never change.
 * @param {...} attributes
 *   Pairs of attributes and their values. This should be used for attributes
 *   that may change.
 */
var ie_open = function(tag, key, statics) {
  var node = alignWithDOM(tag, key, statics);
  
  if (hasChangedAttrs.apply(node, arguments)) {
    var newAttrs = updateNewAttrs.apply(node, arguments);
    
    updateAttributes(node, newAttrs);
  }

  firstChild();
};


/**
 * Declares a virtual element at the current location in the document. This
 * corresponds to an opening tag and a ie_close tag is required. This is like
 * ie_open, but the attributes are defined using the va function rather than
 * being passed as arguments. Must be folllowed by 0 or more calls to va, then
 * a call to ie_open_end.
 *
 * @param {string} tag
 *   The element's tag name.
 * @param {string} key
 *   The key used to identify this element. This can be an empty string, but
 *   performance may be better if a unique value is used when iterating over
 *   an array of items.
 * @param {Array} statics
 *   Pairs of attributes and their values. This should be used for attributes
 *   that will never change.
 */
var ie_open_start = function(tag, key, statics) {
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
  argsBuilder.push(name, value);
};


/**
 * Closes an open tag started with ie_open_start.
 */
var ie_open_end = function() {
  ie_open.apply(this, argsBuilder); 
};


/**
 * Closes an open virtual element.
 */
var ie_close = function(tag) {
  parentNode();
  nextSibling();
};


/**
 * Declare a virtual element that has no children.
 */
var ie_void = function(tag, key, statics) {
  ie_open.apply(this, arguments);
  ie_close.apply(this, arguments);
};


/**
 * Declare a virtual text node at this point in the document.
 *
 * @param {string} value
 */
var itext = function(value) {
  var node = alignWithDOM(undefined, undefined, value);

  if (node.__incrementalDOMText !== value) {
    node.data = value;
    node.__incrementalDOMText = value;
  }

  nextSibling();
};


module.exports = {
  ie_open_start: ie_open_start,
  ie_open_end: ie_open_end,
  ie_open: ie_open,
  ie_void: ie_void,
  ie_close: ie_close,
  itext: itext,
  iattr: iattr
};

