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


/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 * @param {?string} nodeName
 * @param {?string} key
 * @constructor
 */
function NodeData(nodeName, key) {
  /**
   * The attributes and their values.
   * @const {!Object<string, *>}
   */
  this.attrs = {};

  /**
   * An array of attribute name/value pairs, used for quickly diffing the
   * incomming attributes to see if the DOM node's attributes need to be
   * updated.
   * @const {Array<*>}
   */
  this.attrsArr = [];

  /**
   * The incoming attributes for this Node, before they are updated.
   * @const {!Object<string, *>}
   */
  this.newAttrs = {};

  /**
   * The key used to identify this node, used to preserve DOM nodes when they
   * move within their parent.
   * @const {?string}
   */
  this.key = key || null;

  /**
   * Keeps track of children within this node by their key.
   * {?Object<string, Node>}
   */
  this.keyMap = null;

  /**
   * The last child to have been visited within the current pass.
   * {?Node}
   */
  this.lastVisitedChild = null;

  /**
   * The node name for this node.
   * @const {string}
   */
  this.nodeName = nodeName;

  /**
   * The text content of a Text node.
   * {string}
   */
  this.text = null;
}


/**
 * Initializes a NodeData object for a Node.
 *
 * @param {!Node} node The node to initialize data for.
 * @param {string} nodeName The node name of node.
 * @param {?string} key The key that identifies the node.
 * @return {!NodeData} The newly initialized data object
 */
var initData = function(node, nodeName, key) {
  var data = new NodeData(nodeName, key);
  node['__incrementalDOMData'] = data;
  return data;
};


/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 *
 * @param {!Node} node The node to retrieve the data for.
 * @return {NodeData} The NodeData for this Node.
 */
var getData = function(node) {
  var data = node['__incrementalDOMData'];

  if (!data) {
    var nodeName = node.nodeName.toLowerCase();
    var key = null;

    if (node instanceof Element) {
      key = node.getAttribute('key');
    }

    data = initData(node, nodeName, key);
  }

  return data;
};


/**
 * @param {!Node} node A node to get the key for.
 * @return {?string} The key for the Node, if applicable.
 */
var getKey = function(node) {
  return getData(node).key;
};


/**
 * @param {!Node} node A node to get the node name for.
 * @return {string} The node name for the Node.
 */
var getNodeName = function(node) {
  return getData(node).nodeName;
};


/**
 * @param {!Node} node A node to get the attributes hash for.
 * @return {!Object<string, *>} The attributes for the Node.
 */
var getAttrs = function(node) {
  return getData(node).attrs;
};


/**
 * @param {!Node} node A node to get attributes array for.
 * @return {!Array<*>} The attributes array for the Node.
 */
var getAttrsArr = function(node) {
  return getData(node).attrsArr;
};


/**
 * @param {!Node} node A node to get the incoming attributes for.
 * @return {!Object<string, *>} The incoming attributes for the Node.
 */
var getNewAttrs = function(node) {
  return getData(node).newAttrs;
};


/** */
module.exports = {
  getData: getData,
  initData: initData,
  getKey: getKey,
  getNodeName: getNodeName,
  getAttrs: getAttrs,
  getAttrsArr: getAttrsArr,
  getNewAttrs: getNewAttrs
};

