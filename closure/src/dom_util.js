/**
 * @fileoverview added by tsickle
 * Generated from: src/dom_util.ts
 * @suppress {checkTypes,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
goog.module('incrementaldom.src.dom_util');
var module = module || { id: 'src/dom_util.js' };
goog.require('tslib');
const tsickle_assertions_1 = goog.requireType("incrementaldom.src.assertions");
//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */
var assertions_1 = goog.require('incrementaldom.src.assertions');
/**
 * Checks if the node is the root of a document. This is either a Document
 * or ShadowRoot. DocumentFragments are included for simplicity of the
 * implementation, though we only want to consider Documents or ShadowRoots.
 * @param {!Node} node The node to check.
 * @return {boolean} True if the node the root of a document, false otherwise.
 */
function isDocumentRoot(node) {
    return node.nodeType === 11 || node.nodeType === 9;
}
/**
 * Checks if the node is an Element. This is faster than an instanceof check.
 * @param {!Node} node The node to check.
 * @return {boolean} Whether or not the node is an Element.
 */
function isElement(node) {
    return node.nodeType === 1;
}
exports.isElement = isElement;
/**
 * Checks if the node is a text node. This is faster than an instanceof check.
 * @param {!Node} node The node to check.
 * @return {boolean} Whether or not the node is a Text.
 */
function isText(node) {
    return node.nodeType === 3;
}
exports.isText = isText;
/**
 * @param {!Node} node The node to start at, inclusive.
 * @param {(null|!Node)} root The root ancestor to get until, exclusive.
 * @return {!Array<!Node>} The ancestry of DOM nodes.
 */
function getAncestry(node, root) {
    /** @type {!Array<!Node>} */
    const ancestry = [];
    /** @type {(null|!Node)} */
    let cur = node;
    while (cur !== root) {
        /** @type {!Node} */
        const n = assertions_1.assert(cur);
        ancestry.push(n);
        cur = n.parentNode;
    }
    return ancestry;
}
/**
 * \@param this
 * \@return The root node of the DOM tree that contains this node.
 * @type {?}
 */
const getRootNode = (typeof Node !== "undefined" && ((/** @type {?} */ (Node))).prototype.getRootNode) ||
    (/**
     * @this {!Node}
     * @return {!Node}
     */
    function () {
        /** @type {(null|!Node)} */
        let cur = (/** @type {!Node} */ (this));
        /** @type {!Node} */
        let prev = cur;
        while (cur) {
            prev = cur;
            cur = cur.parentNode;
        }
        return prev;
    });
/**
 * @param {!Node} node The node to get the activeElement for.
 * @return {(null|!Element)} The activeElement in the Document or ShadowRoot
 *     corresponding to node, if present.
 */
function getActiveElement(node) {
    /** @type {?} */
    const root = getRootNode.call(node);
    return isDocumentRoot(root) ? root.activeElement : null;
}
/**
 * Gets the path of nodes that contain the focused node in the same document as
 * a reference node, up until the root.
 * @param {!Node} node The reference node to get the activeElement for.
 * @param {(null|!Node)} root The root to get the focused path until.
 * @return {!Array<!Node>} The path of focused parents, if any exist.
 */
function getFocusedPath(node, root) {
    /** @type {(null|!Element)} */
    const activeElement = getActiveElement(node);
    if (!activeElement || !node.contains(activeElement)) {
        return [];
    }
    return getAncestry(activeElement, root);
}
exports.getFocusedPath = getFocusedPath;
/**
 * Like insertBefore, but instead of moving the desired node, it moves all the
 * other nodes after.
 * @param {!Node} parentNode
 * @param {!Node} node
 * @param {(null|!Node)} referenceNode
 * @return {void}
 */
function moveBefore(parentNode, node, referenceNode) {
    /** @type {(null|!ChildNode)} */
    const insertReferenceNode = node.nextSibling;
    /** @type {(null|!Node)} */
    let cur = referenceNode;
    while (cur !== null && cur !== node) {
        /** @type {(null|!ChildNode)} */
        const next = cur.nextSibling;
        parentNode.insertBefore(cur, insertReferenceNode);
        cur = next;
    }
}
exports.moveBefore = moveBefore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZG9tX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFHQSxrRUFBc0M7Ozs7Ozs7O0FBU3RDLFNBQVMsY0FBYyxDQUFDLElBQVU7SUFDaEMsT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQztBQUNyRCxDQUFDOzs7Ozs7QUFPRCxTQUFTLFNBQVMsQ0FBQyxJQUFVO0lBQzNCLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQTRGUSw4QkFBUzs7Ozs7O0FBckZsQixTQUFTLE1BQU0sQ0FBQyxJQUFVO0lBQ3hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQW1GbUIsd0JBQU07Ozs7OztBQTVFMUIsU0FBUyxXQUFXLENBQUMsSUFBVSxFQUFFLElBQWlCOztVQUMxQyxRQUFRLEdBQWdCLEVBQUU7O1FBQzVCLEdBQUcsR0FBZ0IsSUFBSTtJQUUzQixPQUFPLEdBQUcsS0FBSyxJQUFJLEVBQUU7O2NBQ2IsQ0FBQyxHQUFTLG1CQUFNLENBQUMsR0FBRyxDQUFDO1FBQzNCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsR0FBRyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUM7S0FDcEI7SUFFRCxPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDOzs7Ozs7TUFNSyxXQUFXLEdBQ2YsQ0FBQyxPQUFPLElBQUksS0FBSyxXQUFXLElBQUksQ0FBQyxtQkFBQSxJQUFJLEVBQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7Ozs7O0lBQ3BFOztZQUNNLEdBQUcsR0FBZ0IsdUJBQUEsSUFBSSxFQUFROztZQUMvQixJQUFJLEdBQUcsR0FBRztRQUVkLE9BQU8sR0FBRyxFQUFFO1lBQ1YsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUNYLEdBQUcsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO1NBQ3RCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDLENBQUE7Ozs7OztBQU9ILFNBQVMsZ0JBQWdCLENBQUMsSUFBVTs7VUFDNUIsSUFBSSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25DLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDMUQsQ0FBQzs7Ozs7Ozs7QUFTRCxTQUFTLGNBQWMsQ0FBQyxJQUFVLEVBQUUsSUFBaUI7O1VBQzdDLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7SUFFNUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUU7UUFDbkQsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELE9BQU8sV0FBVyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBb0IyQix3Q0FBYzs7Ozs7Ozs7O0FBWDFDLFNBQVMsVUFBVSxDQUFDLFVBQWdCLEVBQUUsSUFBVSxFQUFFLGFBQTBCOztVQUNwRSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsV0FBVzs7UUFDeEMsR0FBRyxHQUFHLGFBQWE7SUFFdkIsT0FBTyxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7O2NBQzdCLElBQUksR0FBRyxHQUFHLENBQUMsV0FBVztRQUM1QixVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2xELEdBQUcsR0FBRyxJQUFJLENBQUM7S0FDWjtBQUNILENBQUM7QUFFMkMsZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAgQ29weXJpZ2h0IDIwMTggVGhlIEluY3JlbWVudGFsIERPTSBBdXRob3JzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLyoqIEBsaWNlbnNlIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wICovXG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gXCIuL2Fzc2VydGlvbnNcIjtcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIG5vZGUgaXMgdGhlIHJvb3Qgb2YgYSBkb2N1bWVudC4gVGhpcyBpcyBlaXRoZXIgYSBEb2N1bWVudFxuICogb3IgU2hhZG93Um9vdC4gRG9jdW1lbnRGcmFnbWVudHMgYXJlIGluY2x1ZGVkIGZvciBzaW1wbGljaXR5IG9mIHRoZVxuICogaW1wbGVtZW50YXRpb24sIHRob3VnaCB3ZSBvbmx5IHdhbnQgdG8gY29uc2lkZXIgRG9jdW1lbnRzIG9yIFNoYWRvd1Jvb3RzLlxuICogQHBhcmFtIG5vZGUgVGhlIG5vZGUgdG8gY2hlY2suXG4gKiBAcmV0dXJuIFRydWUgaWYgdGhlIG5vZGUgdGhlIHJvb3Qgb2YgYSBkb2N1bWVudCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5mdW5jdGlvbiBpc0RvY3VtZW50Um9vdChub2RlOiBOb2RlKTogbm9kZSBpcyBEb2N1bWVudCB8IFNoYWRvd1Jvb3Qge1xuICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gMTEgfHwgbm9kZS5ub2RlVHlwZSA9PT0gOTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIG5vZGUgaXMgYW4gRWxlbWVudC4gVGhpcyBpcyBmYXN0ZXIgdGhhbiBhbiBpbnN0YW5jZW9mIGNoZWNrLlxuICogQHBhcmFtIG5vZGUgVGhlIG5vZGUgdG8gY2hlY2suXG4gKiBAcmV0dXJuIFdoZXRoZXIgb3Igbm90IHRoZSBub2RlIGlzIGFuIEVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGlzRWxlbWVudChub2RlOiBOb2RlKTogbm9kZSBpcyBFbGVtZW50IHtcbiAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDE7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBub2RlIGlzIGEgdGV4dCBub2RlLiBUaGlzIGlzIGZhc3RlciB0aGFuIGFuIGluc3RhbmNlb2YgY2hlY2suXG4gKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSB0byBjaGVjay5cbiAqIEByZXR1cm4gV2hldGhlciBvciBub3QgdGhlIG5vZGUgaXMgYSBUZXh0LlxuICovXG5mdW5jdGlvbiBpc1RleHQobm9kZTogTm9kZSk6IG5vZGUgaXMgVGV4dCB7XG4gIHJldHVybiBub2RlLm5vZGVUeXBlID09PSAzO1xufVxuXG4vKipcbiAqIEBwYXJhbSAgbm9kZSBUaGUgbm9kZSB0byBzdGFydCBhdCwgaW5jbHVzaXZlLlxuICogQHBhcmFtICByb290IFRoZSByb290IGFuY2VzdG9yIHRvIGdldCB1bnRpbCwgZXhjbHVzaXZlLlxuICogQHJldHVybiBUaGUgYW5jZXN0cnkgb2YgRE9NIG5vZGVzLlxuICovXG5mdW5jdGlvbiBnZXRBbmNlc3RyeShub2RlOiBOb2RlLCByb290OiBOb2RlIHwgbnVsbCkge1xuICBjb25zdCBhbmNlc3RyeTogQXJyYXk8Tm9kZT4gPSBbXTtcbiAgbGV0IGN1cjogTm9kZSB8IG51bGwgPSBub2RlO1xuXG4gIHdoaWxlIChjdXIgIT09IHJvb3QpIHtcbiAgICBjb25zdCBuOiBOb2RlID0gYXNzZXJ0KGN1cik7XG4gICAgYW5jZXN0cnkucHVzaChuKTtcbiAgICBjdXIgPSBuLnBhcmVudE5vZGU7XG4gIH1cblxuICByZXR1cm4gYW5jZXN0cnk7XG59XG5cbi8qKlxuICogQHBhcmFtIHRoaXNcbiAqIEByZXR1cm5zIFRoZSByb290IG5vZGUgb2YgdGhlIERPTSB0cmVlIHRoYXQgY29udGFpbnMgdGhpcyBub2RlLlxuICovXG5jb25zdCBnZXRSb290Tm9kZSA9XG4gICh0eXBlb2YgTm9kZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiAoTm9kZSBhcyBhbnkpLnByb3RvdHlwZS5nZXRSb290Tm9kZSkgfHxcbiAgZnVuY3Rpb24odGhpczogTm9kZSkge1xuICAgIGxldCBjdXI6IE5vZGUgfCBudWxsID0gdGhpcyBhcyBOb2RlO1xuICAgIGxldCBwcmV2ID0gY3VyO1xuXG4gICAgd2hpbGUgKGN1cikge1xuICAgICAgcHJldiA9IGN1cjtcbiAgICAgIGN1ciA9IGN1ci5wYXJlbnROb2RlO1xuICAgIH1cblxuICAgIHJldHVybiBwcmV2O1xuICB9O1xuXG4vKipcbiAqIEBwYXJhbSBub2RlIFRoZSBub2RlIHRvIGdldCB0aGUgYWN0aXZlRWxlbWVudCBmb3IuXG4gKiBAcmV0dXJucyBUaGUgYWN0aXZlRWxlbWVudCBpbiB0aGUgRG9jdW1lbnQgb3IgU2hhZG93Um9vdFxuICogICAgIGNvcnJlc3BvbmRpbmcgdG8gbm9kZSwgaWYgcHJlc2VudC5cbiAqL1xuZnVuY3Rpb24gZ2V0QWN0aXZlRWxlbWVudChub2RlOiBOb2RlKTogRWxlbWVudCB8IG51bGwge1xuICBjb25zdCByb290ID0gZ2V0Um9vdE5vZGUuY2FsbChub2RlKTtcbiAgcmV0dXJuIGlzRG9jdW1lbnRSb290KHJvb3QpID8gcm9vdC5hY3RpdmVFbGVtZW50IDogbnVsbDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBwYXRoIG9mIG5vZGVzIHRoYXQgY29udGFpbiB0aGUgZm9jdXNlZCBub2RlIGluIHRoZSBzYW1lIGRvY3VtZW50IGFzXG4gKiBhIHJlZmVyZW5jZSBub2RlLCB1cCB1bnRpbCB0aGUgcm9vdC5cbiAqIEBwYXJhbSBub2RlIFRoZSByZWZlcmVuY2Ugbm9kZSB0byBnZXQgdGhlIGFjdGl2ZUVsZW1lbnQgZm9yLlxuICogQHBhcmFtIHJvb3QgVGhlIHJvb3QgdG8gZ2V0IHRoZSBmb2N1c2VkIHBhdGggdW50aWwuXG4gKiBAcmV0dXJucyBUaGUgcGF0aCBvZiBmb2N1c2VkIHBhcmVudHMsIGlmIGFueSBleGlzdC5cbiAqL1xuZnVuY3Rpb24gZ2V0Rm9jdXNlZFBhdGgobm9kZTogTm9kZSwgcm9vdDogTm9kZSB8IG51bGwpOiBBcnJheTxOb2RlPiB7XG4gIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSBnZXRBY3RpdmVFbGVtZW50KG5vZGUpO1xuXG4gIGlmICghYWN0aXZlRWxlbWVudCB8fCAhbm9kZS5jb250YWlucyhhY3RpdmVFbGVtZW50KSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHJldHVybiBnZXRBbmNlc3RyeShhY3RpdmVFbGVtZW50LCByb290KTtcbn1cblxuLyoqXG4gKiBMaWtlIGluc2VydEJlZm9yZSwgYnV0IGluc3RlYWQgb2YgbW92aW5nIHRoZSBkZXNpcmVkIG5vZGUsIGl0IG1vdmVzIGFsbCB0aGVcbiAqIG90aGVyIG5vZGVzIGFmdGVyLlxuICogQHBhcmFtIHBhcmVudE5vZGVcbiAqIEBwYXJhbSBub2RlXG4gKiBAcGFyYW0gcmVmZXJlbmNlTm9kZVxuICovXG5mdW5jdGlvbiBtb3ZlQmVmb3JlKHBhcmVudE5vZGU6IE5vZGUsIG5vZGU6IE5vZGUsIHJlZmVyZW5jZU5vZGU6IE5vZGUgfCBudWxsKSB7XG4gIGNvbnN0IGluc2VydFJlZmVyZW5jZU5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xuICBsZXQgY3VyID0gcmVmZXJlbmNlTm9kZTtcblxuICB3aGlsZSAoY3VyICE9PSBudWxsICYmIGN1ciAhPT0gbm9kZSkge1xuICAgIGNvbnN0IG5leHQgPSBjdXIubmV4dFNpYmxpbmc7XG4gICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY3VyLCBpbnNlcnRSZWZlcmVuY2VOb2RlKTtcbiAgICBjdXIgPSBuZXh0O1xuICB9XG59XG5cbmV4cG9ydCB7IGlzRWxlbWVudCwgaXNUZXh0LCBnZXRGb2N1c2VkUGF0aCwgbW92ZUJlZm9yZSB9O1xuIl19