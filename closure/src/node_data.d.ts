/** @license SPDX-License-Identifier: Apache-2.0 */
import { Key, NameOrCtorDef } from "./types";
declare global {
    interface Node {
        __incrementalDOMData: NodeData | null;
    }
}
/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 */
export declare class NodeData {
    /**
     * An array of attribute name/value pairs, used for quickly diffing the
     * incomming attributes to see if the DOM node's attributes need to be
     * updated.
     */
    private _attrsArr;
    /**
     * Whether or not the statics have been applied for the node yet.
     */
    staticsApplied: boolean;
    /**
     * The key used to identify this node, used to preserve DOM nodes when they
     * move within their parent.
     */
    readonly key: Key;
    /**
     * The previous text value, for Text nodes.
     */
    text: string | undefined;
    /**
     * The nodeName or contructor for the Node.
     */
    readonly nameOrCtor: NameOrCtorDef;
    alwaysDiffAttributes: boolean;
    constructor(nameOrCtor: NameOrCtorDef, key: Key, text: string | undefined);
    hasEmptyAttrsArr(): boolean;
    getAttrsArr(length: number): Array<any>;
}
/**
 * Initializes a NodeData object for a Node.
 * @param node The Node to initialized data for.
 * @param nameOrCtor The NameOrCtorDef to use when diffing.
 * @param key The Key for the Node.
 * @param text The data of a Text node, if importing a Text node.
 * @returns A NodeData object with the existing attributes initialized.
 */
declare function initData(node: Node, nameOrCtor: NameOrCtorDef, key: Key, text?: string | undefined): NodeData;
/**
 * @param node The node to check.
 * @returns True if the NodeData already exists, false otherwise.
 */
declare function isDataInitialized(node: Node): boolean;
/**
 * Imports node and its subtree, initializing caches.
 * @param node The Node to import.
 */
declare function importNode(node: Node): void;
/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 * @param node The node to get data for.
 * @param fallbackKey A key to use if importing and no key was specified.
 *    Useful when not transmitting keys from serverside render and doing an
 *    immediate no-op diff.
 * @returns The NodeData for the node.
 */
declare function getData(node: Node, fallbackKey?: Key): NodeData;
/**
 * Gets the key for a Node. note that the Node should have been imported
 * by now.
 * @param node The node to check.
 * @returns The key used to create the node.
 */
declare function getKey(node: Node): Key;
/**
 * Clears all caches from a node and all of its children.
 * @param node The Node to clear the cache for.
 */
declare function clearCache(node: Node): void;
export { getData, getKey, initData, importNode, isDataInitialized, clearCache };
