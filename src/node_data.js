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
 * @param {string} tag
 * @param {?string} key
 * @constructor
 */
function NodeData(tag, key) {
  /**
   * The attributes and their values.
   * @const
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
   * @const
   */
  this.key = key;

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
   * The tag for this element.
   * @const
   */
  this.tag = tag;
}


/**
 * Initializes a NodeData object for a Node.
 *
 * @param {!Node} node The node to initialze data for.
 * @param {string} tag The tag of node.
 * @param {?string} key The key that identifies the node.
 * @return {!NodeData} The newly initialized data object
 */
var initData = function(node, tag, key) {
  var data = new NodeData(tag, key);
  node['__incrementalDOMData'] = data;
  return data;
};


/**
 * Retrieves the NodeData object for an Element, creating it if necessary.
 *
 * @param {!Node} node The node to retrieve the data for.
 * @return {?NodeData} The NodeData if an Element, undefined otherwise.
 */
var getData = function(node) {
  var data = node['__incrementalDOMData'];

  if (!data && node.tagName) {
    data = initData(node, node.tagName.toLowerCase(), node.getAttribute('key'));
  }

  return data;
};


/** */
module.exports = {
  getData: getData,
  initData: initData
};

