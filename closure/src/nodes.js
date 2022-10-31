/**
 * @fileoverview added by tsickle
 * Generated from: src/nodes.ts
 * @suppress {checkTypes,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
goog.module('incrementaldom.src.nodes');
var module = module || { id: 'src/nodes.js' };
goog.require('tslib');
const tsickle_node_data_1 = goog.requireType("incrementaldom.src.node_data");
const tsickle_types_2 = goog.requireType("incrementaldom.src.types");
//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */
var node_data_1 = goog.require('incrementaldom.src.node_data');
/**
 * Gets the namespace to create an element (of a given tag) in.
 * @param {string} tag The tag to get the namespace for.
 * @param {(null|!Node)} parent The current parent Node, if any.
 * @return {?} The namespace to use.
 */
function getNamespaceForTag(tag, parent) {
    if (tag === "svg") {
        return "http://www.w3.org/2000/svg";
    }
    if (tag === "math") {
        return "http://www.w3.org/1998/Math/MathML";
    }
    if (parent == null) {
        return null;
    }
    if (node_data_1.getData(parent).nameOrCtor === "foreignObject") {
        return null;
    }
    // Since TypeScript 4.4 namespaceURI is only defined for Attr and Element
    // nodes. Checking for Element nodes here seems reasonable but breaks SVG
    // rendering in Chrome in certain cases. The cast to any should be removed
    // once we know why this happens.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((/** @type {?} */ (parent))).namespaceURI;
}
/**
 * Creates an Element and initializes the NodeData.
 * @param {!Document} doc The document with which to create the Element.
 * @param {(null|!Node)} parent The parent of new Element.
 * @param {(string|!tsickle_types_2.ElementConstructor)} nameOrCtor The tag or constructor for the Element.
 * @param {(undefined|null|string|number)} key A key to identify the Element.
 * @return {!Element} The newly created Element.
 */
function createElement(doc, parent, nameOrCtor, key) {
    /** @type {?} */
    let el;
    if (typeof nameOrCtor === "function") {
        el = new nameOrCtor();
    }
    else {
        /** @type {?} */
        const namespace = getNamespaceForTag(nameOrCtor, parent);
        if (namespace) {
            el = doc.createElementNS(namespace, nameOrCtor);
        }
        else {
            el = doc.createElement(nameOrCtor);
        }
    }
    node_data_1.initData(el, nameOrCtor, key);
    return el;
}
exports.createElement = createElement;
/**
 * Creates a Text Node.
 * @param {!Document} doc The document with which to create the Element.
 * @return {!Text} The newly created Text.
 */
function createText(doc) {
    /** @type {!Text} */
    const node = doc.createTextNode("");
    node_data_1.initData(node, "#text", null);
    return node;
}
exports.createText = createText;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbm9kZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBR0EsZ0VBQWdEOzs7Ozs7O0FBU2hELFNBQVMsa0JBQWtCLENBQUMsR0FBVyxFQUFFLE1BQW1CO0lBQzFELElBQUksR0FBRyxLQUFLLEtBQUssRUFBRTtRQUNqQixPQUFPLDRCQUE0QixDQUFDO0tBQ3JDO0lBRUQsSUFBSSxHQUFHLEtBQUssTUFBTSxFQUFFO1FBQ2xCLE9BQU8sb0NBQW9DLENBQUM7S0FDN0M7SUFFRCxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7UUFDbEIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELElBQUksbUJBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEtBQUssZUFBZSxFQUFFO1FBQ2xELE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCx5RUFBeUU7SUFDekUseUVBQXlFO0lBQ3pFLDBFQUEwRTtJQUMxRSxpQ0FBaUM7SUFDakMsOERBQThEO0lBQzlELE9BQU8sQ0FBQyxtQkFBQSxNQUFNLEVBQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQztBQUN0QyxDQUFDOzs7Ozs7Ozs7QUFVRCxTQUFTLGFBQWEsQ0FDcEIsR0FBYSxFQUNiLE1BQW1CLEVBQ25CLFVBQXlCLEVBQ3pCLEdBQVE7O1FBRUosRUFBRTtJQUVOLElBQUksT0FBTyxVQUFVLEtBQUssVUFBVSxFQUFFO1FBQ3BDLEVBQUUsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0tBQ3ZCO1NBQU07O2NBQ0MsU0FBUyxHQUFHLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUM7UUFFeEQsSUFBSSxTQUFTLEVBQUU7WUFDYixFQUFFLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDakQ7YUFBTTtZQUNMLEVBQUUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3BDO0tBQ0Y7SUFFRCxvQkFBUSxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFOUIsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDO0FBYVEsc0NBQWE7Ozs7OztBQU50QixTQUFTLFVBQVUsQ0FBQyxHQUFhOztVQUN6QixJQUFJLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUM7SUFDbkMsb0JBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlCLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUV1QixnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbIi8vICBDb3B5cmlnaHQgMjAxOCBUaGUgSW5jcmVtZW50YWwgRE9NIEF1dGhvcnMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vKiogQGxpY2Vuc2UgU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjAgKi9cblxuaW1wb3J0IHsgZ2V0RGF0YSwgaW5pdERhdGEgfSBmcm9tIFwiLi9ub2RlX2RhdGFcIjtcbmltcG9ydCB7IEtleSwgTmFtZU9yQ3RvckRlZiB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKlxuICogR2V0cyB0aGUgbmFtZXNwYWNlIHRvIGNyZWF0ZSBhbiBlbGVtZW50IChvZiBhIGdpdmVuIHRhZykgaW4uXG4gKiBAcGFyYW0gdGFnIFRoZSB0YWcgdG8gZ2V0IHRoZSBuYW1lc3BhY2UgZm9yLlxuICogQHBhcmFtIHBhcmVudCBUaGUgY3VycmVudCBwYXJlbnQgTm9kZSwgaWYgYW55LlxuICogQHJldHVybnMgVGhlIG5hbWVzcGFjZSB0byB1c2UuXG4gKi9cbmZ1bmN0aW9uIGdldE5hbWVzcGFjZUZvclRhZyh0YWc6IHN0cmluZywgcGFyZW50OiBOb2RlIHwgbnVsbCkge1xuICBpZiAodGFnID09PSBcInN2Z1wiKSB7XG4gICAgcmV0dXJuIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcbiAgfVxuXG4gIGlmICh0YWcgPT09IFwibWF0aFwiKSB7XG4gICAgcmV0dXJuIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiO1xuICB9XG5cbiAgaWYgKHBhcmVudCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoZ2V0RGF0YShwYXJlbnQpLm5hbWVPckN0b3IgPT09IFwiZm9yZWlnbk9iamVjdFwiKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBTaW5jZSBUeXBlU2NyaXB0IDQuNCBuYW1lc3BhY2VVUkkgaXMgb25seSBkZWZpbmVkIGZvciBBdHRyIGFuZCBFbGVtZW50XG4gIC8vIG5vZGVzLiBDaGVja2luZyBmb3IgRWxlbWVudCBub2RlcyBoZXJlIHNlZW1zIHJlYXNvbmFibGUgYnV0IGJyZWFrcyBTVkdcbiAgLy8gcmVuZGVyaW5nIGluIENocm9tZSBpbiBjZXJ0YWluIGNhc2VzLiBUaGUgY2FzdCB0byBhbnkgc2hvdWxkIGJlIHJlbW92ZWRcbiAgLy8gb25jZSB3ZSBrbm93IHdoeSB0aGlzIGhhcHBlbnMuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gIHJldHVybiAocGFyZW50IGFzIGFueSkubmFtZXNwYWNlVVJJO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gRWxlbWVudCBhbmQgaW5pdGlhbGl6ZXMgdGhlIE5vZGVEYXRhLlxuICogQHBhcmFtIGRvYyBUaGUgZG9jdW1lbnQgd2l0aCB3aGljaCB0byBjcmVhdGUgdGhlIEVsZW1lbnQuXG4gKiBAcGFyYW0gcGFyZW50IFRoZSBwYXJlbnQgb2YgbmV3IEVsZW1lbnQuXG4gKiBAcGFyYW0gbmFtZU9yQ3RvciBUaGUgdGFnIG9yIGNvbnN0cnVjdG9yIGZvciB0aGUgRWxlbWVudC5cbiAqIEBwYXJhbSBrZXkgQSBrZXkgdG8gaWRlbnRpZnkgdGhlIEVsZW1lbnQuXG4gKiBAcmV0dXJucyBUaGUgbmV3bHkgY3JlYXRlZCBFbGVtZW50LlxuICovXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50KFxuICBkb2M6IERvY3VtZW50LFxuICBwYXJlbnQ6IE5vZGUgfCBudWxsLFxuICBuYW1lT3JDdG9yOiBOYW1lT3JDdG9yRGVmLFxuICBrZXk6IEtleVxuKTogRWxlbWVudCB7XG4gIGxldCBlbDtcblxuICBpZiAodHlwZW9mIG5hbWVPckN0b3IgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGVsID0gbmV3IG5hbWVPckN0b3IoKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBuYW1lc3BhY2UgPSBnZXROYW1lc3BhY2VGb3JUYWcobmFtZU9yQ3RvciwgcGFyZW50KTtcblxuICAgIGlmIChuYW1lc3BhY2UpIHtcbiAgICAgIGVsID0gZG9jLmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIG5hbWVPckN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbCA9IGRvYy5jcmVhdGVFbGVtZW50KG5hbWVPckN0b3IpO1xuICAgIH1cbiAgfVxuXG4gIGluaXREYXRhKGVsLCBuYW1lT3JDdG9yLCBrZXkpO1xuXG4gIHJldHVybiBlbDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgVGV4dCBOb2RlLlxuICogQHBhcmFtIGRvYyBUaGUgZG9jdW1lbnQgd2l0aCB3aGljaCB0byBjcmVhdGUgdGhlIEVsZW1lbnQuXG4gKiBAcmV0dXJucyBUaGUgbmV3bHkgY3JlYXRlZCBUZXh0LlxuICovXG5mdW5jdGlvbiBjcmVhdGVUZXh0KGRvYzogRG9jdW1lbnQpOiBUZXh0IHtcbiAgY29uc3Qgbm9kZSA9IGRvYy5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgaW5pdERhdGEobm9kZSwgXCIjdGV4dFwiLCBudWxsKTtcbiAgcmV0dXJuIG5vZGU7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZUVsZW1lbnQsIGNyZWF0ZVRleHQgfTtcbiJdfQ==