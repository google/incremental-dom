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

import { createMap } from './util';


/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 * @param {!string} nodeName
 * @param {?string=} key
 * @constructor
 */
function NodeData(nodeName, key) {
  /**
   * The attributes and their values.
   * @const {!Object<string, *>}
   */
  this.attrs = createMap();

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
  this.newAttrs = createMap();

  /**
   * Whether or not the statics have been applied for the node yet.
   * {boolean}
   */
  this.staticsApplied = false;

  /**
   * The key used to identify this node, used to preserve DOM nodes when they
   * move within their parent.
   * @const
   */
  this.key = key;

  /**
   * Keeps track of children within this node by their key.
   * {!Object<string, !Element>}
   */
  this.keyMap = createMap();

  /**
   * Whether or not the keyMap is currently valid.
   * @type {boolean}
   */
  this.keyMapValid = true;

  /**
   * Whether or the associated node is, or contains, a focused Element.
   * @type {boolean}
   */
  this.focused = false;

  /**
   * The node name for this node.
   * @const {string}
   */
  this.nodeName = nodeName;

  /**
   * @type {?string}
   */
  this.text = null;
}


/**
 * Initializes a NodeData object for a Node.
 *
 * @param {Node} node The node to initialize data for.
 * @param {string} nodeName The node name of node.
 * @param {?string=} key The key that identifies the node.
 * @return {!NodeData} The newly initialized data object
 */
const initData = function(node, nodeName, key) {
  const data = new NodeData(nodeName, key);
  node['__incrementalDOMData'] = data;
  return data;
};


/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 *
 * @param {?Node} node The Node to retrieve the data for.
 * @return {!NodeData} The NodeData for this Node.
 */
const getData = function(node) {
  importNode(node);
  return node['__incrementalDOMData'];
};


/**
 * Imports node and its subtree, initializing caches.
 *
 * @param {?Node} node The Node to import.
 */
const importNode = function(node) {
  if (node['__incrementalDOMData']) {
    return;
  }

  const isElement = node instanceof Element;
  const nodeName = isElement ? node.localName : node.nodeName;
  const key = isElement ? node.getAttribute('key') : null;
  const data = initData(node, nodeName, key);

  if (key) {
    getData(node.parentNode).keyMap[key] = node;
  }

  if (isElement) {
    const attributes = node.attributes;
    const attrs = data.attrs;
    const newAttrs = data.newAttrs;
    const attrsArr = data.attrsArr;

    for (let i = 0; i < attributes.length; i += 1) {
      const attr = attributes[i];
      const name = attr.name;
      const value = attr.value;

      attrs[name] = value;
      newAttrs[name] = undefined;
      attrsArr.push(name);
      attrsArr.push(value);
    }
  }

  for (let child = node.firstChild; child; child = child.nextSibling) {
    importNode(child);
  }
};


/** */
export {
  getData,
  initData,
  importNode
};
