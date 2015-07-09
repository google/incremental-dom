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

import {getWalker} from './walker';
import {getData} from './node_data';


/**
 * Enters a Element, clearing out the last visited child field.
 * @param {!Element} node
 */
function enterNode(node) {
  var data = getData(node);
  data.lastVisitedChild = null;
}


/**
 * Clears out any unvisited Nodes, as the corresponding virtual element
 * functions were never called for them.
 * @param {!Element} node
 */
function exitNode(node) {
  var data = getData(node);
  var lastVisitedChild = data.lastVisitedChild;

  if (node.lastChild === lastVisitedChild) {
    return;
  }

  while (node.lastChild !== lastVisitedChild) {
    node.removeChild(node.lastChild);
  }

  // Invalidate the key map since we removed children. It will get recreated
  // next time we need it.
  data.keyMap = null;
};


/**
 * Marks a parent as having visited a child.
 * @param {!Element} parent
 * @param {!Node} child
 */
export function markVisited(parent, child) {
  var data = getData(parent);
  data.lastVisitedChild = child;
}


/**
 * Changes to the first child of the current node.
 */
export function firstChild() {
  var walker = getWalker();
  enterNode(walker.currentNode);
  walker.firstChild();
}


/**
 * Changes to the next sibling of the current node.
 */
export function nextSibling() {
  var walker = getWalker();
  walker.nextSibling();
}


/**
 * Changes to the parent of the current node, removing any unvisited children.
 */
export function parentNode() {
  var walker = getWalker();
  walker.parentNode();
  exitNode(walker.currentNode);
}
