//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import { Key, NameOrCtorDef } from "./types";
import { assert } from "./assertions";
import { createArray } from "./util";
import { isElement } from "./dom_util";
import { getKeyAttributeName } from "./global";

declare global {
  interface Node {
    __incrementalDOMData: NodeData | null;
  }
}

/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 */
export class NodeData {
  /**
   * An array of attribute name/value pairs, used for quickly diffing the
   * incomming attributes to see if the DOM node's attributes need to be
   * updated.
   */
  private _attrsArr: Array<any> | null = null;

  /**
   * Whether or not the statics have been applied for the node yet.
   */
  public staticsApplied = false;

  /**
   * The key used to identify this node, used to preserve DOM nodes when they
   * move within their parent.
   */
  public readonly key: Key;

  /**
   * The previous text value, for Text nodes.
   */
  public text: string | undefined;

  /**
   * The nodeName or contructor for the Node.
   */
  public readonly nameOrCtor: NameOrCtorDef;

  public alwaysDiffAttributes = false;

  public constructor(
    nameOrCtor: NameOrCtorDef,
    key: Key,
    text: string | undefined
  ) {
    this.nameOrCtor = nameOrCtor;
    this.key = key;
    this.text = text;
  }

  public hasEmptyAttrsArr(): boolean {
    const attrs = this._attrsArr;
    return !attrs || !attrs.length;
  }

  public getAttrsArr(length: number): Array<any> {
    return this._attrsArr || (this._attrsArr = createArray(length));
  }
}

/**
 * Initializes a NodeData object for a Node.
 * @param node The Node to initialized data for.
 * @param nameOrCtor The NameOrCtorDef to use when diffing.
 * @param key The Key for the Node.
 * @param text The data of a Text node, if importing a Text node.
 * @returns A NodeData object with the existing attributes initialized.
 */
function initData(
  node: Node,
  nameOrCtor: NameOrCtorDef,
  key: Key,
  text?: string | undefined
): NodeData {
  const data = new NodeData(nameOrCtor, key, text);
  node["__incrementalDOMData"] = data;
  return data;
}

/**
 * @param node The node to check.
 * @returns True if the NodeData already exists, false otherwise.
 */
function isDataInitialized(node: Node): boolean {
  return Boolean(node["__incrementalDOMData"]);
}

/**
 * Records the element's attributes.
 * @param node The Element that may have attributes
 * @param data The Element's data
 */
function recordAttributes(node: Element, data: NodeData) {
  const attributes = node.attributes;
  const length = attributes.length;
  if (!length) {
    return;
  }

  const attrsArr = data.getAttrsArr(length);

  // Use a cached length. The attributes array is really a live NamedNodeMap,
  // which exists as a DOM "Host Object" (probably as C++ code). This makes the
  // usual constant length iteration very difficult to optimize in JITs.
  for (let i = 0, j = 0; i < length; i += 1, j += 2) {
    const attr = attributes[i];
    const name = attr.name;
    const value = attr.value;

    attrsArr[j] = name;
    attrsArr[j + 1] = value;
  }
}

/**
 * Imports single node and its subtree, initializing caches, if it has not
 * already been imported.
 * @param node The node to import.
 * @param fallbackKey A key to use if importing and no key was specified.
 *    Useful when not transmitting keys from serverside render and doing an
 *    immediate no-op diff.
 * @returns The NodeData for the node.
 */
function importSingleNode(node: Node, fallbackKey?: Key): NodeData {
  if (node["__incrementalDOMData"]) {
    return node["__incrementalDOMData"];
  }

  const nodeName = isElement(node) ? node.localName : node.nodeName;
  const keyAttrName = getKeyAttributeName();
  const keyAttr =
    isElement(node) && keyAttrName != null
      ? node.getAttribute(keyAttrName)
      : null;
  const key = isElement(node) ? keyAttr || fallbackKey : null;
  const data = initData(node, nodeName, key);

  if (isElement(node)) {
    recordAttributes(node, data);
  }

  return data;
}

/**
 * Imports node and its subtree, initializing caches.
 * @param node The Node to import.
 */
function importNode(node: Node) {
  importSingleNode(node);

  for (
    let child: Node | null = node.firstChild;
    child;
    child = child.nextSibling
  ) {
    importNode(child);
  }
}

/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 * @param node The node to get data for.
 * @param fallbackKey A key to use if importing and no key was specified.
 *    Useful when not transmitting keys from serverside render and doing an
 *    immediate no-op diff.
 * @returns The NodeData for the node.
 */
function getData(node: Node, fallbackKey?: Key) {
  return importSingleNode(node, fallbackKey);
}

/**
 * Gets the key for a Node. note that the Node should have been imported
 * by now.
 * @param node The node to check.
 * @returns The key used to create the node.
 */
function getKey(node: Node) {
  assert(node["__incrementalDOMData"]);
  return getData(node).key;
}

/**
 * Clears all caches from a node and all of its children.
 * @param node The Node to clear the cache for.
 */
function clearCache(node: Node) {
  node["__incrementalDOMData"] = null;

  for (
    let child: Node | null = node.firstChild;
    child;
    child = child.nextSibling
  ) {
    clearCache(child);
  }
}

export { getData, getKey, initData, importNode, isDataInitialized, clearCache };
