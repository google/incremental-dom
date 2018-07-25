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

import {Key, NameOrCtorDef, Statics} from './types';
import {isElement, isText} from './dom_util';


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

  text: string|undefined;

  /**
   * The nodeName or contructor for the Node.
   */
  readonly nameOrCtor: NameOrCtorDef;

  constructor(nameOrCtor: NameOrCtorDef, key: Key, text: string|undefined) {
    this.nameOrCtor = nameOrCtor;
    this.key = key;
    this.text = text;
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
    node: Node, nameOrCtor: NameOrCtorDef, key: Key, text?: string|undefined): NodeData {
  const data = new NodeData(nameOrCtor, key, text);
  node['__incrementalDOMData'] = data;
  return data;
}

/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 */
function getData(node: Node, key?: Key, statics?: Statics) {
  return importSingleNode(node, key, statics);
}


/**
 * Imports single node, initializing cache.
 */
function importSingleNode(node: Node, fallbackKey?: Key, statics?: Statics) {
  if (node['__incrementalDOMData']) {
    return node['__incrementalDOMData']!;
  }

  const nodeName = isElement(node) ? node.localName : node.nodeName;
  const key = isElement(node) ? (node.getAttribute('key') || fallbackKey) : null;
  const text = isText(node) ? node.data : undefined;
  const data = initData(node, nodeName!, key, text);
  const staticsKeys:string[] = [];
  if (statics) {
    for (let i = 0; i < statics.length; i+=2) {
      staticsKeys.push(statics[i] as string);
    }
  }

  if (isElement(node)) {
    const attributes = node.attributes;
    const attrsArr = data.attrsArr;

    for (let i = 0; i < attributes.length; i += 1) {
      const attr = attributes[i];
      const name = attr.name;
      const value = attr.value;

      if (staticsKeys.indexOf(name) < 0) {
        attrsArr.push(name);
        attrsArr.push(value);
      }
    }
  }

  return data;
}

/**
 * Imports node and its subtree, initializing caches.
 */
function importNode(node: Node) {
  importSingleNode(node);

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
