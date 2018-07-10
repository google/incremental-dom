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

import {assert} from './assertions';
import {NameOrCtorDef} from './types';
import {createMap} from './util';


/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 */
export class NodeData {
  /**
   * An array of attribute name/value pairs, used for quickly diffing the
   * incomming attributes to see if the DOM node's attributes need to be
   * updated.
   */
  // tslint:disable-next-line:no-any
  readonly attrsArr: any[] = [];

  /**
   * Whether or not the statics have been applied for the node yet.
   */
  staticsApplied = false;

  /**
   * The key used to identify this node, used to preserve DOM nodes when they
   * move within their parent.
   */
  key: string|null|undefined;

  /**
   * Keeps track of children within this node by their key.
   */
  keyMap = createMap();

  text: string|null = null;

  /**
   * The nodeName or contructor for the Node.
   */
  readonly nameOrCtor: NameOrCtorDef;

  // tslint:disable-next-line:no-any
  readonly typeId: any;

  /**
   * Whether or the associated node is, or contains, a focused Element.
   */
  focused = false;

  constructor(
      nameOrCtor: NameOrCtorDef, key: string|null|undefined,
      typeId: {}|null|undefined) {
    this.nameOrCtor = nameOrCtor;
    this.key = key;
    this.typeId = typeId;
  }
}

declare global {
  interface Node {
    '__incrementalDOMData': NodeData|null;
    'typeId': {};
  }
}

/**
 * Initializes a NodeData object for a Node.
 */
function initData(
    node: Node, nameOrCtor: NameOrCtorDef, key: string|null|undefined,
    typeId?: {}|null|undefined): NodeData {
  const data = new NodeData(nameOrCtor, key, typeId);
  node['__incrementalDOMData'] = data;
  return data;
}


/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 */
function getData(node: Node) {
  importNode(node);
  return node['__incrementalDOMData']!;
}

function isElement(n: Node): n is Element {
  return n.nodeType === 1;
}


/**
 * Imports node and its subtree, initializing caches.
 */
function importNode(node: Node) {
  if (node['__incrementalDOMData']) {
    return;
  }

  const nodeName = isElement(node) ? node.localName : node.nodeName;
  const key = isElement(node) ? node.getAttribute('key') : null;
  const typeId = node['typeId'];
  const data = initData(node, nodeName!, key, typeId);

  if (key) {
    const parentNode = assert(node.parentNode);
    const nodeData = getData(parentNode);
    // tslint:disable-next-line:no-any
    (nodeData.keyMap as any)[key] = node;
  }

  if (isElement(node)) {
    const attributes = node.attributes;
    const attrsArr = data.attrsArr;

    for (let i = 0; i < attributes.length; i += 1) {
      const attr = attributes[i];
      const name = attr.name;
      const value = attr.value;

      attrsArr.push(name);
      attrsArr.push(value);
    }
  }

  for (let child = node.firstChild; child; child = child.nextSibling) {
    importNode(child);
  }
}

/**
 * Clears all caches from a node and all of its children.
 */
function clearCache(node: Node) {
  node['__incrementalDOMData'] = null;

  for (let child = node.firstChild; child; child = child.nextSibling) {
    clearCache(child);
  }
}


/** */
export {
  getData,
  initData,
  importNode,
  clearCache,
};
