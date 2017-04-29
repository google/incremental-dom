/**
 * Copyright 2016 The Incremental DOM Authors. All Rights Reserved.
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

import { getData } from './node_data.js';


/**
 * @param {!Node} node
 * @return {boolean} True if the node the root of a document, false otherwise.
 */
const isDocumentRoot = function(node) {
  return node.nodeType === 11 || node.nodeType === 9;
};


/**
 * @param {!Node} node The node to start at, inclusive.
 * @param {?Node} root The root ancestor to get until, exclusive.
 * @return {!Array<!NodeData>} The ancestry of DOM nodes.
 */
const getAncestry = function(node, root) {
  const ancestry = [];
  let cur = node;

  while (cur !== root) {
    ancestry.push(getData(cur));
    cur = cur.parentNode;
  }

  return ancestry;
};


/**
 * @return {!Node} The root node of the DOM tree that contains this node.
 * @this Node
 */
const getRootNode = Node.prototype.getRootNode || function() {
  let cur = this;
  let prev = cur;

  while (cur) {
    prev = cur;
    cur = cur.parentNode;
  }

  return prev;
};


/**
 * @param {!Node} node The node to get the activeElement for.
 * @return {?Element} The activeElement in the Document or ShadowRoot
 *     corresponding to node, if present.
 */
const getActiveElement = function(node) {
  const root = getRootNode.call(node);
  return isDocumentRoot(root) ? root.activeElement : null;
};


/**
 * Gets the path of nodes that contain the focused node in the same document as
 * a reference node, up until the root.
 * @param {!Node} node The reference node to get the activeElement for.
 * @param {?Node} root The root to get the focused path until.
 * @return {!Array<!NodeData>}
 */
const getFocusedPath = function(node, root) {
  const activeElement = getActiveElement(node);

  if (!activeElement || !node.contains(activeElement)) {
    return [];
  }

  return getAncestry(activeElement, root);
};


/**
 * Like insertBefore, but instead instead of moving the desired node, instead
 * moves all the other nodes after.
 * @param {?Node} parentNode
 * @param {!Node} node
 * @param {?Node} referenceNode
 */
const moveBefore = function(parentNode, node, referenceNode) {
  const insertReferenceNode = node.nextSibling;
  let cur = referenceNode;

  while (cur !== node) {
    const next = cur.nextSibling;
    parentNode.insertBefore(cur, insertReferenceNode);
    cur = next;
  }
};


/** */
export {
  getFocusedPath,
  moveBefore
};

