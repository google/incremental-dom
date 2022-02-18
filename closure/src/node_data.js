/**
 * @fileoverview added by tsickle
 * Generated from: src/node_data.ts
 * @suppress {checkTypes,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
goog.module('incrementaldom.src.node_data');
var module = module || { id: 'src/node_data.js' };
goog.require('tslib');
const tsickle_types_1 = goog.requireType("incrementaldom.src.types");
const tsickle_assertions_2 = goog.requireType("incrementaldom.src.assertions");
const tsickle_util_3 = goog.requireType("incrementaldom.src.util");
const tsickle_dom_util_4 = goog.requireType("incrementaldom.src.dom_util");
const tsickle_global_5 = goog.requireType("incrementaldom.src.global");
//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */
var assertions_1 = goog.require('incrementaldom.src.assertions');
var util_1 = goog.require('incrementaldom.src.util');
var dom_util_1 = goog.require('incrementaldom.src.dom_util');
var global_1 = goog.require('incrementaldom.src.global');
/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 */
class NodeData {
    /**
     * @param {(string|!tsickle_types_1.ElementConstructor)} nameOrCtor
     * @param {(undefined|null|string|number)} key
     * @param {(undefined|string)} text
     */
    constructor(nameOrCtor, key, text) {
        /**
         * An array of attribute name/value pairs, used for quickly diffing the
         * incomming attributes to see if the DOM node's attributes need to be
         * updated.
         */
        this._attrsArr = null;
        /**
         * Whether or not the statics have been applied for the node yet.
         */
        this.staticsApplied = false;
        this.alwaysDiffAttributes = false;
        this.nameOrCtor = nameOrCtor;
        this.key = key;
        this.text = text;
    }
    /**
     * @return {boolean}
     */
    hasEmptyAttrsArr() {
        /** @type {(null|!Array<?>)} */
        const attrs = this._attrsArr;
        return !attrs || !attrs.length;
    }
    /**
     * @param {number} length
     * @return {!Array<?>}
     */
    getAttrsArr(length) {
        return this._attrsArr || (this._attrsArr = util_1.createArray(length));
    }
}
exports.NodeData = NodeData;
/* istanbul ignore if */
if (false) {
    /**
     * An array of attribute name/value pairs, used for quickly diffing the
     * incomming attributes to see if the DOM node's attributes need to be
     * updated.
     * @type {(null|!Array<?>)}
     * @private
     */
    NodeData.prototype._attrsArr;
    /**
     * Whether or not the statics have been applied for the node yet.
     * @type {boolean}
     */
    NodeData.prototype.staticsApplied;
    /**
     * The key used to identify this node, used to preserve DOM nodes when they
     * move within their parent.
     * @type {(undefined|null|string|number)}
     */
    NodeData.prototype.key;
    /**
     * The previous text value, for Text nodes.
     * @type {(undefined|string)}
     */
    NodeData.prototype.text;
    /**
     * The nodeName or contructor for the Node.
     * @type {(string|!tsickle_types_1.ElementConstructor)}
     */
    NodeData.prototype.nameOrCtor;
    /** @type {boolean} */
    NodeData.prototype.alwaysDiffAttributes;
}
/**
 * Initializes a NodeData object for a Node.
 * @param {!Node} node The Node to initialized data for.
 * @param {(string|!tsickle_types_1.ElementConstructor)} nameOrCtor The NameOrCtorDef to use when diffing.
 * @param {(undefined|null|string|number)} key The Key for the Node.
 * @param {(undefined|string)=} text The data of a Text node, if importing a Text node.
 * @return {!NodeData} A NodeData object with the existing attributes initialized.
 */
function initData(node, nameOrCtor, key, text) {
    /** @type {!NodeData} */
    const data = new NodeData(nameOrCtor, key, text);
    node["__incrementalDOMData"] = data;
    return data;
}
exports.initData = initData;
/**
 * @param {!Node} node The node to check.
 * @return {boolean} True if the NodeData already exists, false otherwise.
 */
function isDataInitialized(node) {
    return Boolean(node["__incrementalDOMData"]);
}
exports.isDataInitialized = isDataInitialized;
/**
 * Records the element's attributes.
 * @param {!Element} node The Element that may have attributes
 * @param {!NodeData} data The Element's data
 * @return {void}
 */
function recordAttributes(node, data) {
    /** @type {!NamedNodeMap} */
    const attributes = node.attributes;
    /** @type {number} */
    const length = attributes.length;
    if (!length) {
        return;
    }
    /** @type {!Array<?>} */
    const attrsArr = data.getAttrsArr(length);
    // Use a cached length. The attributes array is really a live NamedNodeMap,
    // which exists as a DOM "Host Object" (probably as C++ code). This makes the
    // usual constant length iteration very difficult to optimize in JITs.
    for (let i = 0, j = 0; i < length; i += 1, j += 2) {
        /** @type {!Attr} */
        const attr = attributes[i];
        /** @type {string} */
        const name = attr.name;
        /** @type {string} */
        const value = attr.value;
        attrsArr[j] = name;
        attrsArr[j + 1] = value;
    }
}
/**
 * Imports single node and its subtree, initializing caches, if it has not
 * already been imported.
 * @param {!Node} node The node to import.
 * @param {(undefined|null|string|number)=} fallbackKey A key to use if importing and no key was specified.
 *    Useful when not transmitting keys from serverside render and doing an
 *    immediate no-op diff.
 * @return {!NodeData} The NodeData for the node.
 */
function importSingleNode(node, fallbackKey) {
    if (node["__incrementalDOMData"]) {
        return node["__incrementalDOMData"];
    }
    /** @type {string} */
    const nodeName = dom_util_1.isElement(node) ? node.localName : node.nodeName;
    /** @type {(null|string)} */
    const keyAttrName = global_1.getKeyAttributeName();
    /** @type {(null|string)} */
    const keyAttr = dom_util_1.isElement(node) && keyAttrName != null
        ? node.getAttribute(keyAttrName)
        : null;
    /** @type {(undefined|null|string|number)} */
    const key = dom_util_1.isElement(node) ? keyAttr || fallbackKey : null;
    /** @type {!NodeData} */
    const data = initData(node, nodeName, key);
    if (dom_util_1.isElement(node)) {
        recordAttributes(node, data);
    }
    return data;
}
/**
 * Imports node and its subtree, initializing caches.
 * @param {!Node} node The Node to import.
 * @return {void}
 */
function importNode(node) {
    importSingleNode(node);
    for (let child = node.firstChild; child; child = child.nextSibling) {
        importNode(child);
    }
}
exports.importNode = importNode;
/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 * @param {!Node} node The node to get data for.
 * @param {(undefined|null|string|number)=} fallbackKey A key to use if importing and no key was specified.
 *    Useful when not transmitting keys from serverside render and doing an
 *    immediate no-op diff.
 * @return {!NodeData} The NodeData for the node.
 */
function getData(node, fallbackKey) {
    return importSingleNode(node, fallbackKey);
}
exports.getData = getData;
/**
 * Gets the key for a Node. note that the Node should have been imported
 * by now.
 * @param {!Node} node The node to check.
 * @return {(undefined|null|string|number)} The key used to create the node.
 */
function getKey(node) {
    assertions_1.assert(node["__incrementalDOMData"]);
    return getData(node).key;
}
exports.getKey = getKey;
/**
 * Clears all caches from a node and all of its children.
 * @param {!Node} node The Node to clear the cache for.
 * @return {void}
 */
function clearCache(node) {
    node["__incrementalDOMData"] = null;
    for (let child = node.firstChild; child; child = child.nextSibling) {
        clearCache(child);
    }
}
exports.clearCache = clearCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV9kYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL25vZGVfZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFJQSxrRUFBc0M7QUFDdEMsc0RBQXFDO0FBQ3JDLDhEQUF1QztBQUN2QywwREFBK0M7Ozs7QUFXL0MsTUFBYSxRQUFROzs7Ozs7SUErQm5CLFlBQ0UsVUFBeUIsRUFDekIsR0FBUSxFQUNSLElBQXdCOzs7Ozs7UUE1QmxCLGNBQVMsR0FBc0IsSUFBSSxDQUFDOzs7O1FBS3JDLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBa0J2Qix5QkFBb0IsR0FBRyxLQUFLLENBQUM7UUFPbEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDOzs7O0lBRU0sZ0JBQWdCOztjQUNmLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUztRQUM1QixPQUFPLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUNqQyxDQUFDOzs7OztJQUVNLFdBQVcsQ0FBQyxNQUFjO1FBQy9CLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsa0JBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7Q0FDRjtBQWpERCw0QkFpREM7Ozs7Ozs7Ozs7SUEzQ0MsNkJBQTRDOzs7OztJQUs1QyxrQ0FBOEI7Ozs7OztJQU05Qix1QkFBeUI7Ozs7O0lBS3pCLHdCQUFnQzs7Ozs7SUFLaEMsOEJBQTBDOztJQUUxQyx3Q0FBb0M7Ozs7Ozs7Ozs7QUE4QnRDLFNBQVMsUUFBUSxDQUNmLElBQVUsRUFDVixVQUF5QixFQUN6QixHQUFRLEVBQ1IsSUFBeUI7O1VBRW5CLElBQUksR0FBRyxJQUFJ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SUFDeEIsbUJBQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUMzQixDQUFDO0FBa0JpQix3QkFBTTs7Ozs7O0FBWnhCLFNBQVMsVUFBVSxDQUFDLElBQVU7SUFDNUIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsSUFBSSxDQUFDO0lBRXBDLEtBQ0UsSUFBSSxLQUFLLEdBQWdCLElBQUksQ0FBQyxVQUFVLEVBQ3hDLEtBQUssRUFDTCxLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsRUFDekI7UUFDQSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbkI7QUFDSCxDQUFDO0FBRWtFLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLy8gIENvcHlyaWdodCAyMDE4IFRoZSBJbmNyZW1lbnRhbCBET00gQXV0aG9ycy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8qKiBAbGljZW5zZSBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMCAqL1xuXG5pbXBvcnQgeyBLZXksIE5hbWVPckN0b3JEZWYgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSBcIi4vYXNzZXJ0aW9uc1wiO1xuaW1wb3J0IHsgY3JlYXRlQXJyYXkgfSBmcm9tIFwiLi91dGlsXCI7XG5pbXBvcnQgeyBpc0VsZW1lbnQgfSBmcm9tIFwiLi9kb21fdXRpbFwiO1xuaW1wb3J0IHsgZ2V0S2V5QXR0cmlidXRlTmFtZSB9IGZyb20gXCIuL2dsb2JhbFwiO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIGludGVyZmFjZSBOb2RlIHtcbiAgICBfX2luY3JlbWVudGFsRE9NRGF0YTogTm9kZURhdGEgfCBudWxsO1xuICB9XG59XG5cbi8qKlxuICogS2VlcHMgdHJhY2sgb2YgaW5mb3JtYXRpb24gbmVlZGVkIHRvIHBlcmZvcm0gZGlmZnMgZm9yIGEgZ2l2ZW4gRE9NIG5vZGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBOb2RlRGF0YSB7XG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBhdHRyaWJ1dGUgbmFtZS92YWx1ZSBwYWlycywgdXNlZCBmb3IgcXVpY2tseSBkaWZmaW5nIHRoZVxuICAgKiBpbmNvbW1pbmcgYXR0cmlidXRlcyB0byBzZWUgaWYgdGhlIERPTSBub2RlJ3MgYXR0cmlidXRlcyBuZWVkIHRvIGJlXG4gICAqIHVwZGF0ZWQuXG4gICAqL1xuICBwcml2YXRlIF9hdHRyc0FycjogQXJyYXk8YW55PiB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgc3RhdGljcyBoYXZlIGJlZW4gYXBwbGllZCBmb3IgdGhlIG5vZGUgeWV0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpY3NBcHBsaWVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSBrZXkgdXNlZCB0byBpZGVudGlmeSB0aGlzIG5vZGUsIHVzZWQgdG8gcHJlc2VydmUgRE9NIG5vZGVzIHdoZW4gdGhleVxuICAgKiBtb3ZlIHdpdGhpbiB0aGVpciBwYXJlbnQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkga2V5OiBLZXk7XG5cbiAgLyoqXG4gICAqIFRoZSBwcmV2aW91cyB0ZXh0IHZhbHVlLCBmb3IgVGV4dCBub2Rlcy5cbiAgICovXG4gIHB1YmxpYyB0ZXh0OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIFRoZSBub2RlTmFtZSBvciBjb250cnVjdG9yIGZvciB0aGUgTm9kZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBuYW1lT3JDdG9yOiBOYW1lT3JDdG9yRGVmO1xuXG4gIHB1YmxpYyBhbHdheXNEaWZmQXR0cmlidXRlcyA9IGZhbHNlO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICBuYW1lT3JDdG9yOiBOYW1lT3JDdG9yRGVmLFxuICAgIGtleTogS2V5LFxuICAgIHRleHQ6IHN0cmluZyB8IHVuZGVmaW5lZFxuICApIHtcbiAgICB0aGlzLm5hbWVPckN0b3IgPSBuYW1lT3JDdG9yO1xuICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gIH1cblxuICBwdWJsaWMgaGFzRW1wdHlBdHRyc0FycigpOiBib29sZWFuIHtcbiAgICBjb25zdCBhdHRycyA9IHRoaXMuX2F0dHJzQXJyO1xuICAgIHJldHVybiAhYXR0cnMgfHwgIWF0dHJzLmxlbmd0aDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRBdHRyc0FycihsZW5ndGg6IG51bWJlcik6IEFycmF5PGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9hdHRyc0FyciB8fCAodGhpcy5fYXR0cnNBcnIgPSBjcmVhdGVBcnJheShsZW5ndGgpKTtcbiAgfVxufVxuXG4vKipcbiAqIEluaXRpYWxpemVzIGEgTm9kZURhdGEgb2JqZWN0IGZvciBhIE5vZGUuXG4gKiBAcGFyYW0gbm9kZSBUaGUgTm9kZSB0byBpbml0aWFsaXplZCBkYXRhIGZvci5cbiAqIEBwYXJhbSBuYW1lT3JDdG9yIFRoZSBOYW1lT3JDdG9yRGVmIHRvIHVzZSB3aGVuIGRpZmZpbmcuXG4gKiBAcGFyYW0ga2V5IFRoZSBLZXkgZm9yIHRoZSBOb2RlLlxuICogQHBhcmFtIHRleHQgVGhlIGRhdGEgb2YgYSBUZXh0IG5vZGUsIGlmIGltcG9ydGluZyBhIFRleHQgbm9kZS5cbiAqIEByZXR1cm5zIEEgTm9kZURhdGEgb2JqZWN0IHdpdGggdGhlIGV4aXN0aW5nIGF0dHJpYnV0ZXMgaW5pdGlhbGl6ZWQuXG4gKi9cbmZ1bmN0aW9uIGluaXREYXRhKFxuICBub2RlOiBOb2RlLFxuICBuYW1lT3JDdG9yOiBOYW1lT3JDdG9yRGVmLFxuICBrZXk6IEtleSxcbiAgdGV4dD86IHN0cmluZyB8IHVuZGVmaW5lZFxuKTogTm9kZURhdGEge1xuICBjb25zdCBkYXRhID0gbmV3IE5vZGVEYXRhKG5hbWVPckN0b3IsIGtleSwgdGV4dCk7XG4gIG5vZGVbXCJfX2luY3JlbWVudGFsRE9NRGF0YVwiXSA9IGRhdGE7XG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIEBwYXJhbSBub2RlIFRoZSBub2RlIHRvIGNoZWNrLlxuICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgTm9kZURhdGEgYWxyZWFkeSBleGlzdHMsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuZnVuY3Rpb24gaXNEYXRhSW5pdGlhbGl6ZWQobm9kZTogTm9kZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gQm9vbGVhbihub2RlW1wiX19pbmNyZW1lbnRhbERPTURhdGFcIl0pO1xufVxuXG4vKipcbiAqIFJlY29yZHMgdGhlIGVsZW1lbnQncyBhdHRyaWJ1dGVzLlxuICogQHBhcmFtIG5vZGUgVGhlIEVsZW1lbnQgdGhhdCBtYXkgaGF2ZSBhdHRyaWJ1dGVzXG4gKiBAcGFyYW0gZGF0YSBUaGUgRWxlbWVudCdzIGRhdGFcbiAqL1xuZnVuY3Rpb24gcmVjb3JkQXR0cmlidXRlcyhub2RlOiBFbGVtZW50LCBkYXRhOiBOb2RlRGF0YSkge1xuICBjb25zdCBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzO1xuICBjb25zdCBsZW5ndGggPSBhdHRyaWJ1dGVzLmxlbmd0aDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBhdHRyc0FyciA9IGRhdGEuZ2V0QXR0cnNBcnIobGVuZ3RoKTtcblxuICAvLyBVc2UgYSBjYWNoZWQgbGVuZ3RoLiBUaGUgYXR0cmlidXRlcyBhcnJheSBpcyByZWFsbHkgYSBsaXZlIE5hbWVkTm9kZU1hcCxcbiAgLy8gd2hpY2ggZXhpc3RzIGFzIGEgRE9NIFwiSG9zdCBPYmplY3RcIiAocHJvYmFibHkgYXMgQysrIGNvZGUpLiBUaGlzIG1ha2VzIHRoZVxuICAvLyB1c3VhbCBjb25zdGFudCBsZW5ndGggaXRlcmF0aW9uIHZlcnkgZGlmZmljdWx0IHRvIG9wdGltaXplIGluIEpJVHMuXG4gIGZvciAobGV0IGkgPSAwLCBqID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxLCBqICs9IDIpIHtcbiAgICBjb25zdCBhdHRyID0gYXR0cmlidXRlc1tpXTtcbiAgICBjb25zdCBuYW1lID0gYXR0ci5uYW1lO1xuICAgIGNvbnN0IHZhbHVlID0gYXR0ci52YWx1ZTtcblxuICAgIGF0dHJzQXJyW2pdID0gbmFtZTtcbiAgICBhdHRyc0FycltqICsgMV0gPSB2YWx1ZTtcbiAgfVxufVxuXG4vKipcbiAqIEltcG9ydHMgc2luZ2xlIG5vZGUgYW5kIGl0cyBzdWJ0cmVlLCBpbml0aWFsaXppbmcgY2FjaGVzLCBpZiBpdCBoYXMgbm90XG4gKiBhbHJlYWR5IGJlZW4gaW1wb3J0ZWQuXG4gKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSB0byBpbXBvcnQuXG4gKiBAcGFyYW0gZmFsbGJhY2tLZXkgQSBrZXkgdG8gdXNlIGlmIGltcG9ydGluZyBhbmQgbm8ga2V5IHdhcyBzcGVjaWZpZWQuXG4gKiAgICBVc2VmdWwgd2hlbiBub3QgdHJhbnNtaXR0aW5nIGtleXMgZnJvbSBzZXJ2ZXJzaWRlIHJlbmRlciBhbmQgZG9pbmcgYW5cbiAqICAgIGltbWVkaWF0ZSBuby1vcCBkaWZmLlxuICogQHJldHVybnMgVGhlIE5vZGVEYXRhIGZvciB0aGUgbm9kZS5cbiAqL1xuZnVuY3Rpb24gaW1wb3J0U2luZ2xlTm9kZShub2RlOiBOb2RlLCBmYWxsYmFja0tleT86IEtleSk6IE5vZGVEYXRhIHtcbiAgaWYgKG5vZGVbXCJfX2luY3JlbWVudGFsRE9NRGF0YVwiXSkge1xuICAgIHJldHVybiBub2RlW1wiX19pbmNyZW1lbnRhbERPTURhdGFcIl07XG4gIH1cblxuICBjb25zdCBub2RlTmFtZSA9IGlzRWxlbWVudChub2RlKSA/IG5vZGUubG9jYWxOYW1lIDogbm9kZS5ub2RlTmFtZTtcbiAgY29uc3Qga2V5QXR0ck5hbWUgPSBnZXRLZXlBdHRyaWJ1dGVOYW1lKCk7XG4gIGNvbnN0IGtleUF0dHIgPVxuICAgIGlzRWxlbWVudChub2RlKSAmJiBrZXlBdHRyTmFtZSAhPSBudWxsXG4gICAgICA/IG5vZGUuZ2V0QXR0cmlidXRlKGtleUF0dHJOYW1lKVxuICAgICAgOiBudWxsO1xuICBjb25zdCBrZXkgPSBpc0VsZW1lbnQobm9kZSkgPyBrZXlBdHRyIHx8IGZhbGxiYWNrS2V5IDogbnVsbDtcbiAgY29uc3QgZGF0YSA9IGluaXREYXRhKG5vZGUsIG5vZGVOYW1lLCBrZXkpO1xuXG4gIGlmIChpc0VsZW1lbnQobm9kZSkpIHtcbiAgICByZWNvcmRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEpO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbi8qKlxuICogSW1wb3J0cyBub2RlIGFuZCBpdHMgc3VidHJlZSwgaW5pdGlhbGl6aW5nIGNhY2hlcy5cbiAqIEBwYXJhbSBub2RlIFRoZSBOb2RlIHRvIGltcG9ydC5cbiAqL1xuZnVuY3Rpb24gaW1wb3J0Tm9kZShub2RlOiBOb2RlKSB7XG4gIGltcG9ydFNpbmdsZU5vZGUobm9kZSk7XG5cbiAgZm9yIChcbiAgICBsZXQgY2hpbGQ6IE5vZGUgfCBudWxsID0gbm9kZS5maXJzdENoaWxkO1xuICAgIGNoaWxkO1xuICAgIGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmdcbiAgKSB7XG4gICAgaW1wb3J0Tm9kZShjaGlsZCk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIE5vZGVEYXRhIG9iamVjdCBmb3IgYSBOb2RlLCBjcmVhdGluZyBpdCBpZiBuZWNlc3NhcnkuXG4gKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSB0byBnZXQgZGF0YSBmb3IuXG4gKiBAcGFyYW0gZmFsbGJhY2tLZXkgQSBrZXkgdG8gdXNlIGlmIGltcG9ydGluZyBhbmQgbm8ga2V5IHdhcyBzcGVjaWZpZWQuXG4gKiAgICBVc2VmdWwgd2hlbiBub3QgdHJhbnNtaXR0aW5nIGtleXMgZnJvbSBzZXJ2ZXJzaWRlIHJlbmRlciBhbmQgZG9pbmcgYW5cbiAqICAgIGltbWVkaWF0ZSBuby1vcCBkaWZmLlxuICogQHJldHVybnMgVGhlIE5vZGVEYXRhIGZvciB0aGUgbm9kZS5cbiAqL1xuZnVuY3Rpb24gZ2V0RGF0YShub2RlOiBOb2RlLCBmYWxsYmFja0tleT86IEtleSkge1xuICByZXR1cm4gaW1wb3J0U2luZ2xlTm9kZShub2RlLCBmYWxsYmFja0tleSk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUga2V5IGZvciBhIE5vZGUuIG5vdGUgdGhhdCB0aGUgTm9kZSBzaG91bGQgaGF2ZSBiZWVuIGltcG9ydGVkXG4gKiBieSBub3cuXG4gKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIFRoZSBrZXkgdXNlZCB0byBjcmVhdGUgdGhlIG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGdldEtleShub2RlOiBOb2RlKSB7XG4gIGFzc2VydChub2RlW1wiX19pbmNyZW1lbnRhbERPTURhdGFcIl0pO1xuICByZXR1cm4gZ2V0RGF0YShub2RlKS5rZXk7XG59XG5cbi8qKlxuICogQ2xlYXJzIGFsbCBjYWNoZXMgZnJvbSBhIG5vZGUgYW5kIGFsbCBvZiBpdHMgY2hpbGRyZW4uXG4gKiBAcGFyYW0gbm9kZSBUaGUgTm9kZSB0byBjbGVhciB0aGUgY2FjaGUgZm9yLlxuICovXG5mdW5jdGlvbiBjbGVhckNhY2hlKG5vZGU6IE5vZGUpIHtcbiAgbm9kZVtcIl9faW5jcmVtZW50YWxET01EYXRhXCJdID0gbnVsbDtcblxuICBmb3IgKFxuICAgIGxldCBjaGlsZDogTm9kZSB8IG51bGwgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgY2hpbGQ7XG4gICAgY2hpbGQgPSBjaGlsZC5uZXh0U2libGluZ1xuICApIHtcbiAgICBjbGVhckNhY2hlKGNoaWxkKTtcbiAgfVxufVxuXG5leHBvcnQgeyBnZXREYXRhLCBnZXRLZXksIGluaXREYXRhLCBpbXBvcnROb2RlLCBpc0RhdGFJbml0aWFsaXplZCwgY2xlYXJDYWNoZSB9O1xuIl19