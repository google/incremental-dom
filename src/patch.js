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

var importElement = require('./nodes').importElement;
var traversal = require('./traversal'),
    firstChild = traversal.firstChild,
    parentNode = traversal.parentNode;
var TreeWalker = require('./tree_walker').TreeWalker;
var setWalker = require('./walker').setWalker;


/**
 * Imports an element and all the elements under it.
 */
var importTree = function(root) {
  // TODO - don't rely on querySelectorAll so that you could patch things that aren't real DOM nodes
  var nodes = root.querySelectorAll('*');

  for(var i=0; i<nodes.length; i++) {
     importElement(nodes[i]);
  }

  importElement(root);
};


/**
 * Patches the document starting at el with the provided function.
 */
var patch = function(el, fn) {
  setWalker(new TreeWalker(el));

  if (!el.__idomImported) {
    el.__idomImported = true;
    importTree(el);
  }

  firstChild();
  fn();
  parentNode();

  setWalker(null);
};


module.exports = {
  patch: patch
};

