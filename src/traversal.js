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

import { getContext } from './context';
import { getData } from './node_data';
import {
  enterTag,
  exitTag
} from './namespace';


// For https://github.com/esperantojs/esperanto/issues/187
var dummy;


/**
 * Enters an Element, setting the current namespace for nested elements.
 * @param {Node} node
 */
var enterNode = function(node) {
  var data = getData(node);
  enterTag(data.nodeName);
};


/**
 * Exits an Element, unwinding the current namespace to the previous value.
 * @param {Node} node
 */
var exitNode = function(node) {
  var data = getData(node);
  exitTag(data.nodeName);
};


/**
 * Marks node's parent as having visited node.
 * @param {Node} node
 */
var markVisited = function(node) {
  var context = getContext();
  var walker = context.walker;
  var parent = walker.getCurrentParent();
  var data = getData(parent);
  data.lastVisitedChild = node;
};


/**
 * Changes to the first child of the current node.
 */
var firstChild = function() {
  var context = getContext();
  var walker = context.walker;
  enterNode(walker.currentNode);
  walker.firstChild();
};


/**
 * Changes to the next sibling of the current node.
 */
var nextSibling = function() {
  var context = getContext();
  var walker = context.walker;
  markVisited(walker.currentNode);
  walker.nextSibling();
};


/**
 * Changes to the parent of the current node, removing any unvisited children.
 */
var parentNode = function() {
  var context = getContext();
  var walker = context.walker;
  walker.parentNode();
  exitNode(walker.currentNode);
};


/** */
export {
  firstChild,
  nextSibling,
  parentNode
};
