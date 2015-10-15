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
 * Similar to the built-in Treewalker class, but simplified and allows direct
 * access to modify the currentNode property.
 * @param {!Element|!DocumentFragment} node The root Node of the subtree the
 *     walker should start traversing.
 * @constructor
 */
export function TreeWalker(node) {
  /**
   * Keeps track of the current parent node. This is necessary as the traversal
   * methods may traverse past the last child and we still need a way to get
   * back to the parent.
   * @const @private {!Array<!Node>}
   */
  this.stack_ = [];

  /**
   * @const {!Element|!DocumentFragment}
   */
  this.root = node;

  /**
   * @type {?Node}
   */
  this.currentNode = node;
}


/**
 * @return {!Node} The current parent of the current location in the subtree.
 */
TreeWalker.prototype.getCurrentParent = function() {
  return this.stack_[this.stack_.length - 1];
};


/**
 * Changes the current location the firstChild of the current location.
 */
TreeWalker.prototype.firstChild = function() {
  this.stack_.push(this.currentNode);
  this.currentNode = this.currentNode.firstChild;
};


/**
 * Changes the current location the nextSibling of the current location.
 */
TreeWalker.prototype.nextSibling = function() {
  this.currentNode = this.currentNode.nextSibling;
};


/**
 * Changes the current location the parentNode of the current location.
 */
TreeWalker.prototype.parentNode = function() {
  this.currentNode = this.stack_.pop();
};
