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

var nodes = require('./nodes'),
    createNode = nodes.createNode,
    getKey = nodes.getKey,
    getTag = nodes.getTag,
    getChild = nodes.getChild,
    registerChild = nodes.registerChild;
var markVisited = require('./traversal').markVisited;
var getWalker = require('./walker').getWalker;


var matches = function(node, tag, key) {
  return node &&
         key === getKey(node) &&
         tag === getTag(node);
};


/**
 * @param {string|null} tag
 *  For an Element, this should be a valid tag string
 *  For a text node, this should be null
 * @param {string|null} key
 *  The key used to identify this element
 * @param {Array|string} statics
 *  For an Element, this should be an array of name-value pairs
 *  For a text node, this should be the text content of the node
 */
var alignWithDOM = function(tag, key, statics) {
  var walker = getWalker();
  var currentNode = walker.currentNode;
  var parent = walker.getCurrentParent();
  var matchingNode;

  if (matches(currentNode, tag, key)) {
    matchingNode = currentNode;
  } else {
    var existingNode = key && getChild(parent, key);

    if (existingNode) {
      matchingNode = existingNode;
    } else {
      matchingNode = createNode(walker.doc, tag, key, statics);
      registerChild(parent, key, matchingNode);
    }

    parent.insertBefore(matchingNode, currentNode);
    walker.currentNode = matchingNode;
  }

  markVisited(parent, matchingNode);

  return matchingNode;
};


module.exports = {
  alignWithDOM: alignWithDOM
};
