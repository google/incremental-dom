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
 * Initializes the fields needed for a node.
 *
 * @param {!Document|!Element} node The node to initialize data for.
 * @param {string} nodeName The node name of node.
 * @param {?string} key The key that identifies the node.
 */
var initData = function(node, nodeName, key) {
  node['__incrementalDOMKey'] = key;
  node['__incrementalDOMNodeName'] = nodeName;
  node['__incrementalDOMLastVisitedChild'] = null;
  node['__incrementalDOMAttrsArr'] = [];
  node['__incrementalDOMAttrs'] = {};
  node['__incrementalDOMNewAttrs'] = {};
  node['__incrementalDOMKeyMap'] = null;
};


/**
 * @param {!Text} node The Text node to initialize data for.
 */
var initTextData = function(node) {
  node['__incrementalDOMKey'] = null;
  node['__incrementalDOMNodeName'] = '#text';
  node['__incrementalDOMText'] = null;
};


/**
 * Imports a single existing node, initializing the data fields.
 * @param {!Document|!Element} node
 */
var importSingleNode = function(node) {
  var nodeName = node.nodeName.toLowerCase();
  var key = null;

  if (node instanceof Element) {
    key = node.getAttribute('key');
  }

  if (nodeName === '#text') {
    initTextData(node);
  } else {
    initData(node, nodeName, key);
  }
};


/**
 * Imports a node and its subtree, initializing the data fields.
 * @param {!Document|!Element} node
 */
var importNode = function(node) {
  if (node['__incrementalDOMNodeName']) {
    return;
  }

  var iter = document.createNodeIterator(node);
  var current;

  while (current = iter.nextNode()) {
    importSingleNode(current);
  }
};


/** */
export {
  initData,
  initTextData,
  importNode
};

