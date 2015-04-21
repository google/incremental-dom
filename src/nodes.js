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

var updateAttribute = require('./attributes').updateAttribute;
var nodeData = require('./node_data'),
    getData = nodeData.getData,
    initData = nodeData.initData;


var createElement = function(doc, tag, key, staticAttrs) {
  var el = doc.createElement(tag);
  initData(el, tag, key);

  if (staticAttrs) {
    for(var i=0; i<staticAttrs.length; i+=2) {
      updateAttribute(el, staticAttrs[i], staticAttrs[i+1]);
    }
  }

  return el;
};


var createTextNode = function(doc, text) {
  var node = doc.createTextNode(text);
  node.__incrementalDOMText = text;

  return node;
};


var createNode = function(doc, tag, key, statics) {
  if (tag) {
    return createElement(doc, tag, key, statics);
  }

  return createTextNode(doc, statics);
};


var createKeyMap = function(el) {
  var map = {};
  var children = el.children;
  var count = children.length;
  
  for(var i=0; i<count; i++) {
    var child = children[i];
    var key = getKey(child);

    if (key) {
      map[key] = child;
    }
  }

  return map;
};


var getKey = function(el) {
  var data = getData(el);

  if (data) {
    return data.key;
  }
};


var getTag = function(el) {
  var data = getData(el);

  if (data) {
    return data.tag;
  }
};


var getKeyMap = function(el) {
  var data = getData(el);

  if (!data.keyMap) {
    data.keyMap = createKeyMap(el);
  }

  return data.keyMap;
};


var getChild = function(parent, key) {
  return getKeyMap(parent)[key];
};


// Registers a node as being a child
var registerChild = function(parent, key, child) {
  if (key) {
    getKeyMap(parent)[key] = child;
  }
};


module.exports =  {
  createNode: createNode,
  getKey: getKey,
  getTag: getTag,
  getChild: getChild,
  registerChild: registerChild
};

