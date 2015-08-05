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

import { getWalker } from './walker';
import {
  enterTag,
  exitTag
} from './namespace';


// For https://github.com/esperantojs/esperanto/issues/187
var dummy;


/**
 * Enters an Element, setting the current namespace for nested elements.
 * @param {!Element} node
 */
var enterNode = function(node) {
  enterTag(node['__incrementalDOMNodeName']);
};


/**
 * Exits an Element, unwinding the current namespace to the previous value.
 * @param {!Element} node
 */
var exitNode = function(node) {
  exitTag(node['__incrementalDOMNodeName']);
};


/**
 * Marks node's parent as having visited node.
 * @param {!Node} node
 */
var markVisited = function(node) {
  var walker = getWalker();
  var parent = walker.getCurrentParent();
  parent['__incrementalDOMLastVisitedChild'] = node;
};


/**
 * Changes to the first child of the current node.
 */
var firstChild = function() {
  var walker = getWalker();
  enterNode(walker.currentNode);
  walker.firstChild();
};


/**
 * Changes to the next sibling of the current node.
 */
var nextSibling = function() {
  var walker = getWalker();
  markVisited(walker.currentNode);
  walker.nextSibling();
};


/**
 * Changes to the parent of the current node, removing any unvisited children.
 */
var parentNode = function() {
  var walker = getWalker();
  walker.parentNode();
  exitNode(walker.currentNode);
};


/** */
export {
  firstChild,
  nextSibling,
  parentNode
};

