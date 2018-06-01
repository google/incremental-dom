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

/**
 * @return True if the node the root of a document, false otherwise.
 */
function isDocumentRoot(node: Node): boolean {
  return node.nodeType === 11 || node.nodeType === 9;
}

/**
 * @param  node The node to start at, inclusive.
 * @param  root The root ancestor to get until, exclusive.
 * @return The ancestry of DOM nodes.
 */
function getAncestry(node: Node, root: Node|null) {
  const ancestry: Node[] = [];
  let cur: Node|null = node;

  while (cur !== root) {
    assert(cur);
    const n:Node = cur!;
    ancestry.push(n);
    cur = n.parentNode;
  }

  return ancestry;
}

/**
 * return The root node of the DOM tree that contains this node.
 */
const getRootNode =
    // tslint:disable-next-line:no-any b/79476176
    (Node as any).prototype.getRootNode || function(this: Node) {
      // tslint:disable-next-line:no-unnecessary-type-assertion b/77361044
      let cur: Node|null = this as Node;
      let prev = cur;

      while (cur) {
        prev = cur;
        cur = cur.parentNode;
      }

      return prev;
    };


/**
 * @param node The node to get the activeElement for.
 * @return The activeElement in the Document or ShadowRoot
 *     corresponding to node, if present.
 */
function getActiveElement(node: Node): Element|null {
  const root = getRootNode.call(node);
  return isDocumentRoot(root) ? root.activeElement : null;
}


/**
 * Gets the path of nodes that contain the focused node in the same document as
 * a reference node, up until the root.
 * @param node The reference node to get the activeElement for.
 * @param root The root to get the focused path until.
 */
function getFocusedPath(node: Node, root: Node|null): Node[] {
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
function moveBefore(parentNode: Node, node: Node, referenceNode: Node|null) {
  const insertReferenceNode = node.nextSibling;
  let cur = referenceNode;

  while (cur !== null && cur !== node) {
    const next = cur.nextSibling;
    parentNode.insertBefore(cur, insertReferenceNode);
    cur = next;
  }
}


export {
  getFocusedPath,
  moveBefore,
};
