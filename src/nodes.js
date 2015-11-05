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

import { updateAttribute } from './attributes';
import {
    getData,
    initData
} from './node_data';
import { createMap } from './util';


/**
 * Gets the namespace to create an element (of a given tag) in.
 * @param {string} tag The tag to get the namespace for.
 * @param {!Node} parent
 * @return {?string} The namespace to create the tag in.
 */
var getNamespaceForTag = function(tag, parent) {
  if (tag === 'svg') {
    return 'http://www.w3.org/2000/svg';
  }

  if (getData(parent).nodeName === 'foreignObject') {
    return null;
  }

  return parent.namespaceURI;
};


/**
 * Creates an Element.
 * @param {Document} doc The document with which to create the Element.
 * @param {string} tag The tag for the Element.
 * @param {?string=} key A key to identify the Element.
 * @param {?Array<*>=} statics The static data to initialize the Node
 *     with. For an Element, an array of attribute name/value pairs of
 *     the static attributes for the Element.
 * @param {!Node} parent
 * @return {!Element}
 */
var createElement = function(doc, tag, key, statics, parent) {
  var namespace = getNamespaceForTag(tag, parent);
  var el;

  if (namespace) {
    el = doc.createElementNS(namespace, tag);
  } else {
    el = doc.createElement(tag);
  }

  initData(el, tag, key);

  if (statics) {
    for (var i = 0; i < statics.length; i += 2) {
      updateAttribute(el, /** @type {!string}*/(statics[i]), statics[i + 1]);
    }
  }

  return el;
};


/**
 * Creates a Text.
 * @param {Document} doc The document with which to create the Text.
 * @param {string} tag The tag for the Text.
 * @param {*} unused1
 * @param {*} unused2
 * @param {*} unused3
 * @return {!Text}
 */
var createText = function(doc, tag, unused1, unused2, unused3) {
  var node = doc.createTextNode('');
  initData(node, tag, null);
  return node;
};


/**
 * Creates a mapping that can be used to look up children using a key.
 * @param {!Node} el
 * @return {!Object<string, !Element>} A mapping of keys to the children of the
 *     Element.
 */
var createKeyMap = function(el) {
  var map = createMap();
  var children = el.children;
  var count = children.length;

  for (var i = 0; i < count; i += 1) {
    var child = children[i];
    var key = getData(child).key;

    if (key) {
      map[key] = child;
    }
  }

  return map;
};


/**
 * Retrieves the mapping of key to child node for a given Element, creating it
 * if necessary.
 * @param {!Node} el
 * @return {!Object<string, !Node>} A mapping of keys to child Elements
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
 * @param {!Node} parent
 * @param {?string=} key
 * @return {?Element} The child corresponding to the key.
 */
var getChild = function(parent, key) {
  return getKeyMap(parent)[key];
};


/**
 * Registers an element as being a child. The parent will keep track of the
 * child using the key. The child can be retrieved using the same key using
 * getKeyMap. The provided key should be unique within the parent Element.
 * @param {!Node} parent The parent of child.
 * @param {string} key A key to identify the child with.
 * @param {!Node} child The child to register.
 */
var registerChild = function(parent, key, child) {
  getKeyMap(parent)[key] = child;
};


/** */
export {
  createElement,
  createText,
  getChild,
  registerChild
};
