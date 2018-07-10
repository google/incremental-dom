/**
 * @fileoverview
 * @suppress {extraRequire}
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
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

import {getData, initData} from './node_data';
import {NameOrCtorDef} from './types';


/**
 * Gets the namespace to create an element (of a given tag) in.
 */
function getNamespaceForTag(tag: string, parent: Node|null) {
  if (tag === 'svg') {
    return 'http://www.w3.org/2000/svg';
  }

  if (parent == null) {
    return null;
  }

  if (getData(parent).nameOrCtor === 'foreignObject') {
    return null;
  }

  return parent.namespaceURI;
}


/**
 * Creates an Element.
 * @param doc The document with which to create the Element.
 * @param nameOrCtor The tag or constructor for the Element.
 * @param key A key to identify the Element.
 * @param  typeId The type identifier for the Element.
 */
function createElement(
    doc: Document, parent: Node|null, nameOrCtor: NameOrCtorDef,
    key: string|undefined|null, typeId: {}|null|undefined = null): Element {
  let el;

  if (nameOrCtor instanceof Function) {
    // tslint:disable-next-line:no-any
    el = new (nameOrCtor as any)();
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
}


/**
 * Creates a Text Node.
 * @param doc The document with which to create the Element.
 * @return
 */
function createText(doc: Document) {
  const node = doc.createTextNode('');
  initData(node, '#text', null);
  return node;
}


/** */
export {
  createElement,
  createText,
};
