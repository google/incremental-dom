/** @license SPDX-License-Identifier: Apache-2.0 */
/**
 * Checks if the node is an Element. This is faster than an instanceof check.
 * @param node The node to check.
 * @return Whether or not the node is an Element.
 */
declare function isElement(node: Node): node is Element;
/**
 * Checks if the node is a text node. This is faster than an instanceof check.
 * @param node The node to check.
 * @return Whether or not the node is a Text.
 */
declare function isText(node: Node): node is Text;
/**
 * Gets the path of nodes that contain the focused node in the same document as
 * a reference node, up until the root.
 * @param node The reference node to get the activeElement for.
 * @param root The root to get the focused path until.
 * @returns The path of focused parents, if any exist.
 */
declare function getFocusedPath(node: Node, root: Node | null): Array<Node>;
/**
 * Like insertBefore, but instead of moving the desired node, it moves all the
 * other nodes after.
 * @param parentNode
 * @param node
 * @param referenceNode
 */
declare function moveBefore(parentNode: Node, node: Node, referenceNode: Node | null): void;
export { isElement, isText, getFocusedPath, moveBefore };
