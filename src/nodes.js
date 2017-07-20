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

import { NameOrCtorDef } from './types.js';
import {
    getData,
    initData
} from './node_data.js';


/**
 * Gets the namespace to create an element (of a given tag) in.
 * @param {string} tag The tag to get the namespace for.
 * @param {?Node} parent
 * @return {?string} The namespace to create the tag in.
 */
const getNamespaceForTag = function(tag, parent) {
  if (tag === 'svg') {
    return 'http://www.w3.org/2000/svg';
  }

  if (getData(parent).nameOrCtor === 'foreignObject') {
    return null;
  }

  return parent.namespaceURI;
};


/**
 * Creates an Element.
 * @param {Document} doc The document with which to create the Element.
 * @param {?Node} parent
 * @param {NameOrCtorDef} nameOrCtor The tag or constructor for the Element.
 * @param {?string=} key A key to identify the Element.
 * @param {number} typeId The type identifier for the Element.
 * @return {!Element}
 */
const createElement = function(doc, parent, nameOrCtor, key, typeId) {
  let el;

  if (typeof nameOrCtor === 'function') {
    el = new nameOrCtor();
  } else {
    const namespace = getNamespaceForTag(nameOrCtor, parent);

    if (namespace) {
      el = doc.createElementNS(namespace, nameOrCtor);
    } else {
      el = doc.createElement(nameOrCtor);
    }
  }

  initData(el, nameOrCtor, key, typeId);

  return el;
};


/**
 * Creates a Text Node.
 * @param {Document} doc The document with which to create the Element.
 * @return {!Text}
 */
const createText = function(doc) {
  const node = doc.createTextNode('');
  initData(node, '#text', null, -Infinity);
  return node;
};


/** */
export {
  createElement,
  createText
};
