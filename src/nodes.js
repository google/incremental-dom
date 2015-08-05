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

import { attributes } from './attributes';
import {
  initData,
  initTextData
} from './node_data';
import { getNamespaceForTag } from './namespace';


// For https://github.com/esperantojs/esperanto/issues/187
var dummy;


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
  var namespace = getNamespaceForTag(tag);
  var el;

  if (namespace) {
    el = doc.createElementNS(namespace, tag);
  } else {
    el = doc.createElement(tag);
  }

  initData(el, tag, key);

  if (statics) {
    for (var i = 0; i < statics.length; i += 2) {
      attributes.updateAttribute(el, statics[i], statics[i + 1]);
    }
  }

  return el;
};


/**
 * Creates a Node, either a Text or an Element depending on the node name
 * provided.
 * @param {!Document} doc The document with which to create the Node.
 * @param {?string} nodeName The tag if creating an element or undefined to
 *     create a Text.
 * @param {?string} key A key to identify the Element.
 * @param {?Array<*>} statics The static data to initialize the Node
 *     with. For an Element, an array of attribute name/value pairs of
 *     the static attributes for the Element.
 * @return {!Node}
 */
var createNode = function(doc, nodeName, key, statics) {
  if (nodeName === '#text') {
    var node = doc.createTextNode('');
    initTextData(node);
    return node;
  }

  return createElement(doc, nodeName, key, statics);
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
    var key = child['__incrementalDOMKey'];

    if (key) {
      map[key] = child;
    }
  }

  return map;
};


/**
 * Retrieves the mapping of key to child node for a given Element, creating it
 * if necessary.
 * @param {!Element} el
 * @return {!Object<string,!Node>} A mapping of keys to child Nodes
 */
var getKeyMap = function(el) {
  var keyMap = el['__incrementalDOMKeyMap'];

  if (!keyMap) {
    keyMap = el['__incrementalDOMKeyMap'] = createKeyMap(el);
  }

  return keyMap;
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
 * Registers a node as being a child. The parent will keep track of the child
 * using the key. The child can be retrieved using the same key using
 * getKeyMap. The provided key should be unique within the parent Element.
 * @param {!Element} parent The parent of child.
 * @param {string} key A key to identify the child with.
 * @param {!Node} child The child to register.
 */
var registerChild = function(parent, key, child) {
  getKeyMap(parent)[key] = child;
};


/** */
export {
  createNode,
  getChild,
  registerChild
};

