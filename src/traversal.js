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

var getWalker = require('./walker').getWalker;
var getData = require('./node_data').getData;


var enterNode = function(node) {
  var data = getData(node);
  data.lastVisitedChild = null;
};


// Sweep out any unused nodes
var exitNode = function(node) {
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


var markVisited = function(parent, child) {
  var data = getData(parent);
  data.lastVisitedChild = child;
};


var firstChild = function() {
  var walker = getWalker();
  enterNode(walker.currentNode);
  walker.firstChild();
};


var nextSibling = function() {
  var walker = getWalker();
  walker.nextSibling();
};


var parentNode = function() {
  var walker = getWalker();
  walker.parentNode();
  exitNode(walker.currentNode);
};


module.exports = {
  firstChild: firstChild,
  nextSibling: nextSibling,
  parentNode: parentNode,
  markVisited: markVisited
};
