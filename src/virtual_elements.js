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
var getShouldUpdateHook = require('./hooks').getShouldUpdateHook;
var getData = require('./node_data').getData;
var traversal = require('./traversal'),
    firstChild = traversal.firstChild,
    nextSibling = traversal.nextSibling,
    parentNode = traversal.parentNode;


/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 */
var ATTRIBUTES_OFFSET = 3;


var hasChangedAttrs = function() {
  var data = getData(this);
  var attrsArr = data.attrsArr;
  var attrsChanged = false;  

  for (var i=ATTRIBUTES_OFFSET; i<arguments.length; i+=2) {
    if (attrsArr[(i - ATTRIBUTES_OFFSET) >> 1] !== arguments[i+1]) {
      attrsChanged = true;
      break;
    }
  }

  if (attrsChanged) {
    for (var i=ATTRIBUTES_OFFSET; i<arguments.length; i+=2) {
      attrsArr[(i - ATTRIBUTES_OFFSET) >> 1] = arguments[i+1];
    }
  }

  return attrsChanged;
};


var updateAttributes = function() {
  for (var i=ATTRIBUTES_OFFSET; i<arguments.length; i+=2) {
    updateAttribute(this, arguments[i], arguments[i+1]);
  }
};


/**
 * Declares a virtual element at the current location in the document. This
 * corresponds to an opening tag and a ve_close tag is required.
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
var ve_open = function(tag, key, statics) {
  var node = alignWithDOM(tag, key, statics);
  
  if (arguments.length > ATTRIBUTES_OFFSET && hasChangedAttrs.apply(node, arguments)) {
    updateAttributes.apply(node, arguments);
  }

  firstChild();
};


/**
 * Declare a virtual element that has no children.
 */
var ve_void = function(tag, key, statics) {
  ve_open.apply(this, arguments);
  ve_close.apply(this, arguments);
};


var ve_component = function(tag, key, statics) {
  var node = alignWithDOM(tag, key, statics);
  var data = getData(node);
  var attrs = data.attrs;
  var newAttrs = data.newAttrs;

  for (var i=ATTRIBUTES_OFFSET; i<arguments.length; i+=2) {
    newAttrs[arguments[i]] = arguments[i+1];
  }

  var shouldUpdate = attrs.shouldUpdate || node.shouldUpdate || getShouldUpdateHook(data.attrs);
  var renderChildren = attrs.renderChildren || node.renderChildren;
  var dirty;
 
  if (!data.rendered) {
    dirty = true;
  } else if (shouldUpdate) {
    dirty = shouldUpdate.call(node, data.attrs, newAttrs);
  } else {
    dirty = true;
  }

  if (arguments.length > ATTRIBUTES_OFFSET && hasChangedAttrs.apply(node, arguments)) {
    updateAttributes.apply(node, arguments);
  }

  if (dirty) {
    firstChild();

    renderChildren.call(node, newAttrs);
    data.rendered = true;

    parentNode();
  }

  nextSibling();
};


/**
 * Closes an open virtual element.
 */
var ve_close = function(tag) {
  parentNode();
  nextSibling();
};


/**
 * Declare a virtual text node at this point in the document.
 *
 * @param {string} value
 */
var vt = function(value) {
  var node = alignWithDOM(undefined, undefined, value);

  if (node.__incrementalDOMText !== value) {
    node.data = value;
    node.__incrementalDOMText = value;
  }

  nextSibling();
};


module.exports = {
  ve_open: ve_open,
  ve_void: ve_void,
  ve_close: ve_close,
  ve_component: ve_component,
  vt: vt
};

