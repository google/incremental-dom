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


/**
 * Creates an Element.
 * @param {!Document} doc The document with which to create the Element.
 * @param {string} tag The tag for the Element.
 * @param {?string} key A key to identify the Element.
 * @param {?Array<*>} statics An array of attribute name/value pairs of
 *     the static attributes for the Element.
 * @return {!Element}
 */
var createElement = function(doc, tag, key, statics) {
  var el = doc.createElement(tag);
  initData(el, tag, key);

  if (statics) {
    for (var i = 0; i < statics.length; i += 2) {
      updateAttribute(el, statics[i], statics[i + 1]);
    }
  }

  return el;
};

/**
 * Creates a TextNode.
 * @param {!Document} doc The document with which to create the TextNode.
 * @param {string} text The intial content of the TextNode.
 * @return {!TextNode}
 */
var createTextNode = function(doc, text) {
  var node = doc.createTextNode(text);
  node['__incrementalDOMText'] = text;

  return node;
};


/**
 * Creates a Node, either a TextNode or an Element. If a tag is specified, then
 * an Element is created, otherwise a TextNode is created.
 * @param {!Document} doc The document with which to create the Node.
 * @param {string} tag The tag for the Node.
 * @param {?string} key A key to identify the Element.
 * @param {?Array<*>|string} statics The static data to initialize the Node
 *     with. For an Element, an array of attribute name/value pairs of
 *     the static attributes for the Element. For a TextNode, a strign with the
 *     intial content of the TextNode.
 * @return {!Node}
 */
var createNode = function(doc, tag, key, statics) {
  if (tag) {
    return createElement(doc, tag, key, statics);
  }

  return createTextNode(doc, statics);
};


/**
 * Creates a mapping that can be used to look up children using a key.
 * @param {!Element} el
 * @return {!Object<string, !Node>} A mapping of keys to the children of the
 *     Element.
 */
var createKeyMap = function(el) {
  var map = {};
  var children = el.children;
  var count = children.length;

  for (var i = 0; i < count; i += 1) {
    var child = children[i];
    var key = getKey(child);

    if (key) {
      map[key] = child;
    }
  }

  return map;
};


/**
 * @param {?Node} node A node to get the key for.
 * @return {?string} The key for the Node, if applicable.
 */
var getKey = function(node) {
  var data = getData(node);

  if (data) {
    return data.key;
  }
};


/**
 * @param {?Node} node A node to get the tag for.
 * @return {?string} The tag for the Node, if applicable.
 */
var getTag = function(node) {
  var data = getData(node);

  if (data) {
    return data.tag;
  }
};


/**
 * Retrieves the mapping of key to child node for a given Element, creating it
 * if necessary.
 * @param {!Element} el
 * @return {!Object<string,!Node>} A mapping of keys to child Nodes
 */
var getKeyMap = function(el) {
  var data = getData(el);

  if (!data.keyMap) {
    data.keyMap = createKeyMap(el);
  }

  return data.keyMap;
};


/**
 * Retrieves a child from the parent with the given key.
 * @param {!Element} parent
 * @param {?string} key
 * @return {?Node} The child corresponding to the key.
 */
var getChild = function(parent, key) {
  return getKeyMap(parent)[key];
};


/**
 * Registers a node as being a child. If a key is provided, the parent will
 * keep track of the child using the key. The child can be retrieved using the
 * same key using getKeyMap. The provided key should be unique within the
 * parent Element.
 * @param {!Element} parent The parent of child.
 * @param {?string} key A key to identify the child with.
 * @param {!Node} child The child to register.
 */
var registerChild = function(parent, key, child) {
  if (key) {
    getKeyMap(parent)[key] = child;
  }
};


/** */
module.exports = {
  createNode: createNode,
  getKey: getKey,
  getTag: getTag,
  getChild: getChild,
  registerChild: registerChild
};

