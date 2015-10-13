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


/**
 * Marks node's parent as having visited node.
 * @param {Node} node
 */
var markVisited = function(node) {
  var context = getContext();
  var walker = context.walker;
  var parent = walker.currentParent;
  var data = getData(parent);
  data.lastVisitedChild = node;
};


/**
 * Changes to the first child of the current node.
 */
var firstChild = function() {
  var context = getContext();
  var walker = context.walker;
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
};


/** */
export {
  firstChild,
  nextSibling,
  parentNode
};
