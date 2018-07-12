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

import {Key, NameOrCtorDef} from './types';
import {isElement} from './dom_util';


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
  key: Key;

  text: string|null = null;

  /**
   * The nodeName or contructor for the Node.
   */
  readonly nameOrCtor: NameOrCtorDef;

  /**
   * Whether or the associated node is, or contains, a focused Element.
   */
  focused = false;

  constructor(nameOrCtor: NameOrCtorDef, key: Key) {
    this.nameOrCtor = nameOrCtor;
    this.key = key;
  }
}

declare global {
  interface Node {
    '__incrementalDOMData': NodeData|null;
  }
}

/**
 * Initializes a NodeData object for a Node.
 */
function initData(
    node: Node, nameOrCtor: NameOrCtorDef, key: Key): NodeData {
  const data = new NodeData(nameOrCtor, key);
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


/**
 * Imports node and its subtree, initializing caches.
 */
function importNode(node: Node) {
  if (node['__incrementalDOMData']) {
    return;
  }

  const nodeName = isElement(node) ? node.localName : node.nodeName;
  const key = isElement(node) ? node.getAttribute('key') : null;
  const data = initData(node, nodeName!, key);

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
