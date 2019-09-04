/**
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

import { assert } from "./assertions";

/**
 * Checks if the node is the root of a document. This is either a Document
 * or ShadowRoot. DocumentFragments are included for simplicity of the
 * implementation, though we only want to consider Documents or ShadowRoots.
 * @param node The node to check.
 * @return True if the node the root of a document, false otherwise.
 */
function isDocumentRoot(node: Node): node is Document | ShadowRoot {
  return node.nodeType === 11 || node.nodeType === 9;
}

/**
 * Checks if the node is an Element. This is faster than an instanceof check.
 * @param node The node to check.
 * @return Whether or not the node is an Element.
 */
function isElement(node: Node): node is Element {
  return node.nodeType === 1;
}

/**
 * Checks if the node is a text node. This is faster than an instanceof check.
 * @param node The node to check.
 * @return Whether or not the node is a Text.
 */
function isText(node: Node): node is Text {
  return node.nodeType === 3;
}

/**
 * @param  node The node to start at, inclusive.
 * @param  root The root ancestor to get until, exclusive.
 * @return The ancestry of DOM nodes.
 */
function getAncestry(node: Node, root: Node | null) {
  const ancestry: Array<Node> = [];
  let cur: Node | null = node;

  while (cur !== root) {
    const n: Node = assert(cur);
    ancestry.push(n);
    cur = n.parentNode;
  }

  return ancestry;
}

/**
 * @param this
 * @returns The root node of the DOM tree that contains this node.
 */
const getRootNode =
  (typeof Node !== "undefined" && (Node as any).prototype.getRootNode) ||
  function(this: Node) {
    let cur: Node | null = this as Node;
    let prev = cur;

    while (cur) {
      prev = cur;
      cur = cur.parentNode;
    }

    return prev;
  };

/**
 * @param node The node to get the activeElement for.
 * @returns The activeElement in the Document or ShadowRoot
 *     corresponding to node, if present.
 */
function getActiveElement(node: Node): Element | null {
  const root = getRootNode.call(node);
  return isDocumentRoot(root) ? root.activeElement : null;
}

/**
 * Gets the path of nodes that contain the focused node in the same document as
 * a reference node, up until the root.
 * @param node The reference node to get the activeElement for.
 * @param root The root to get the focused path until.
 * @returns The path of focused parents, if any exist.
 */
function getFocusedPath(node: Node, root: Node | null): Array<Node> {
  const activeElement = getActiveElement(node);

  if (!activeElement || !node.contains(activeElement)) {
    return [];
  }

  return getAncestry(activeElement, root);
}

/**
 * Like insertBefore, but instead instead of moving the desired node, instead
 * moves all the other nodes after.
 * @param parentNode
 * @param node
 * @param referenceNode
 */
function moveBefore(parentNode: Node, node: Node, referenceNode: Node | null) {
  const insertReferenceNode = node.nextSibling;
  let cur = referenceNode;

  while (cur !== null && cur !== node) {
    const next = cur.nextSibling;
    parentNode.insertBefore(cur, insertReferenceNode);
    cur = next;
  }
}

export { isElement, isText, getFocusedPath, moveBefore };
