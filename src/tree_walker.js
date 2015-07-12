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
 * @param {!Node} node The root Node of the subtree the walker should start
 *     traversing.
 * @constructor
 */
function TreeWalker(node) {
  /**
   * Keeps track of the current parent node. This is necessary as the traversal
   * methods may traverse past the last child and we still need a way to get
   * back to the parent.
   * @const @private {!Array<!Node>}
   */
  this.stack_ = [node];

  /**
   * Keeps a cached copy of the currentNode's parent.
   * @private {?Node}
   */
  this.parent_ = node;

  /** {?Node} */
  this.currentNode = node;

  /** {!Document} */
  this.doc = node.ownerDocument;

  /**
   * Keeps track of what namespace to create new Elements in.
   * @const @private {!Array<string>}
   */
  this.nsStack_ = [''];

  /**
   * Keeps a cached copy of the namespace.
   * @private {string}
   */
  this.ns_ = '';
}


/**
 * @return {!Node} The current parent of the current location in the subtree.
 */
TreeWalker.prototype.getCurrentParent = function() {
  return this.parent_;
};


/**
 * @return {string} The current namespace to create Elements in.
 */
TreeWalker.prototype.getCurrentNamespace = function() {
  return this.ns_;
};


/**
 * @param {string} namespace The namespace to enter.
 */
TreeWalker.prototype.enterNamespace = function(namespace) {
  this.ns_ = namespace;
  this.nsStack_.push(namespace);
};


/**
 * Exits the current namespace
 */
TreeWalker.prototype.exitNamespace = function() {
  var stack = this.nsStack_;
  stack.pop();
  this.ns_ = stack[stack.length - 1];
};


/**
 * Changes the current location the firstChild of the current location.
 */
TreeWalker.prototype.firstChild = function() {
  var currentNode = this.currentNode;
  this.parent_ = currentNode;
  this.stack_.push(currentNode);
  this.currentNode = currentNode.firstChild;
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
  var stack = this.stack_;
  this.currentNode = stack.pop();
  this.parent_ = stack[stack.length - 1];
};


/** */
module.exports = TreeWalker;

