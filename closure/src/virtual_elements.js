/**
 * @fileoverview added by tsickle
 * Generated from: src/virtual_elements.ts
 * @suppress {checkTypes,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
goog.module('incrementaldom.src.virtual_elements');
var module = module || { id: 'src/virtual_elements.js' };
goog.require('tslib');
const tsickle_assertions_1 = goog.requireType("incrementaldom.src.assertions");
const tsickle_attributes_2 = goog.requireType("incrementaldom.src.attributes");
const tsickle_core_3 = goog.requireType("incrementaldom.src.core");
const tsickle_global_4 = goog.requireType("incrementaldom.src.global");
const tsickle_node_data_5 = goog.requireType("incrementaldom.src.node_data");
const tsickle_types_6 = goog.requireType("incrementaldom.src.types");
const tsickle_util_7 = goog.requireType("incrementaldom.src.util");
const tsickle_diff_8 = goog.requireType("incrementaldom.src.diff");
//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */
var assertions_1 = goog.require('incrementaldom.src.assertions');
var attributes_1 = goog.require('incrementaldom.src.attributes');
var core_1 = goog.require('incrementaldom.src.core');
var global_1 = goog.require('incrementaldom.src.global');
var node_data_1 = goog.require('incrementaldom.src.node_data');
var util_1 = goog.require('incrementaldom.src.util');
var diff_1 = goog.require('incrementaldom.src.diff');
/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 * @type {number}
 */
const ATTRIBUTES_OFFSET = 3;
/**
 * Used to keep track of the previous values when a 2-way diff is necessary.
 * This object is reused.
 * TODO(sparhamI) Scope this to a patch so you can call patch from an attribute
 * update.
 * @type {?}
 */
const prevAttrsMap = util_1.createMap();
/**
 * @param {!Element} element The Element to diff the attrs for.
 * @param {!tsickle_node_data_5.NodeData} data The NodeData associated with the Element.
 * @param {!tsickle_types_6.AttrMutatorConfig} attrs The attribute map of mutators
 * @return {void}
 */
function diffAttrs(element, data, attrs) {
    /** @type {!Array<?>} */
    const attrsBuilder = core_1.getAttrsBuilder();
    /** @type {!Array<?>} */
    const prevAttrsArr = data.getAttrsArr(attrsBuilder.length);
    diff_1.calculateDiff(prevAttrsArr, attrsBuilder, element, attributes_1.updateAttribute, attrs, data.alwaysDiffAttributes);
    util_1.truncateArray(attrsBuilder, 0);
}
/**
 * Applies the statics. When importing an Element, any existing attributes that
 * match a static are converted into a static attribute.
 * @param {!Element} node The Element to apply statics for.
 * @param {!tsickle_node_data_5.NodeData} data The NodeData associated with the Element.
 * @param {(undefined|null|!Array<*>)} statics The statics array.
 * @param {!tsickle_types_6.AttrMutatorConfig} attrs The attribute map of mutators.
 * @return {void}
 */
function diffStatics(node, data, statics, attrs) {
    if (data.staticsApplied) {
        return;
    }
    data.staticsApplied = true;
    if (!statics || !statics.length) {
        return;
    }
    if (data.hasEmptyAttrsArr()) {
        for (let i = 0; i < statics.length; i += 2) {
            attributes_1.updateAttribute(node, (/** @type {string} */ (statics[i])), statics[i + 1], attrs);
        }
        return;
    }
    for (let i = 0; i < statics.length; i += 2) {
        prevAttrsMap[(/** @type {string} */ (statics[i]))] = i + 1;
    }
    /** @type {!Array<?>} */
    const attrsArr = data.getAttrsArr(0);
    /** @type {number} */
    let j = 0;
    for (let i = 0; i < attrsArr.length; i += 2) {
        /** @type {?} */
        const name = attrsArr[i];
        /** @type {?} */
        const value = attrsArr[i + 1];
        /** @type {?} */
        const staticsIndex = prevAttrsMap[name];
        if (staticsIndex) {
            // For any attrs that are static and have the same value, make sure we do
            // not set them again.
            if (statics[staticsIndex] === value) {
                delete prevAttrsMap[name];
            }
            continue;
        }
        // For any attrs that are dynamic, move them up to the right place.
        attrsArr[j] = name;
        attrsArr[j + 1] = value;
        j += 2;
    }
    // Anything after `j` was either moved up already or static.
    util_1.truncateArray(attrsArr, j);
    for (const name in prevAttrsMap) {
        attributes_1.updateAttribute(node, name, statics[prevAttrsMap[name]], attrs);
        delete prevAttrsMap[name];
    }
}
/**
 * Declares a virtual Element at the current location in the document. This
 * corresponds to an opening tag and a elementClose tag is required. This is
 * like elementOpen, but the attributes are defined using the attr function
 * rather than being passed as arguments. Must be folllowed by 0 or more calls
 * to attr, then a call to elementOpenEnd.
 * @param {(string|!tsickle_types_6.ElementConstructor)} nameOrCtor The Element's tag or constructor.
 * @param {(undefined|null|string|number)=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {(undefined|null|!Array<*>)=} statics An array of attribute name/value pairs of the static
 *     attributes for the Element. Attributes will only be set once when the
 *     Element is created.
 * @return {void}
 */
function elementOpenStart(nameOrCtor, key, statics) {
    /** @type {!Array<?>} */
    const argsBuilder = core_1.getArgsBuilder();
    if (global_1.DEBUG) {
        assertions_1.assertNotInAttributes("elementOpenStart");
        assertions_1.setInAttributes(true);
    }
    argsBuilder[0] = nameOrCtor;
    argsBuilder[1] = key;
    argsBuilder[2] = statics;
}
exports.elementOpenStart = elementOpenStart;
/**
 * Allows you to define a key after an elementOpenStart. This is useful in
 * templates that define key after an element has been opened ie
 * `<div key('foo')></div>`.
 * @param {string} key The key to use for the next call.
 * @return {void}
 */
function key(key) {
    /** @type {!Array<?>} */
    const argsBuilder = core_1.getArgsBuilder();
    if (global_1.DEBUG) {
        assertions_1.assertInAttributes("key");
        assertions_1.assert(argsBuilder);
    }
    argsBuilder[1] = key;
}
exports.key = key;
/**
 * Buffers an attribute, which will get applied during the next call to
 * `elementOpen`, `elementOpenEnd` or `applyAttrs`.
 * @param {string} name The of the attribute to buffer.
 * @param {?} value The value of the attribute to buffer.
 * @return {void}
 */
function attr(name, value) {
    /** @type {!Array<?>} */
    const attrsBuilder = core_1.getAttrsBuilder();
    if (global_1.DEBUG) {
        assertions_1.assertInPatch("attr");
    }
    attrsBuilder.push(name);
    attrsBuilder.push(value);
}
exports.attr = attr;
/**
 * @return {string} The value of the nonce attribute.
 */
function getNonce() {
    /** @type {!Array<?>} */
    const argsBuilder = core_1.getArgsBuilder();
    /** @type {(undefined|null|!Array<*>)} */
    const statics = (/** @type {(undefined|null|!Array<*>)} */ (argsBuilder[2]));
    if (statics) {
        for (let i = 0; i < statics.length; i += 2) {
            if (statics[i] === "nonce") {
                return (/** @type {string} */ (statics[i + 1]));
            }
        }
    }
    return "";
}
/**
 * Closes an open tag started with elementOpenStart.
 * @return {!HTMLElement} The corresponding Element.
 */
function elementOpenEnd() {
    /** @type {!Array<?>} */
    const argsBuilder = core_1.getArgsBuilder();
    if (global_1.DEBUG) {
        assertions_1.assertInAttributes("elementOpenEnd");
        assertions_1.setInAttributes(false);
    }
    /** @type {!HTMLElement} */
    const node = core_1.open((/** @type {(string|!tsickle_types_6.ElementConstructor)} */ (argsBuilder[0])), (/** @type {(undefined|null|string|number)} */ (argsBuilder[1])), getNonce());
    /** @type {!tsickle_node_data_5.NodeData} */
    const data = node_data_1.getData(node);
    diffStatics(node, data, (/** @type {(undefined|null|!Array<*>)} */ (argsBuilder[2])), attributes_1.attributes);
    diffAttrs(node, data, attributes_1.attributes);
    util_1.truncateArray(argsBuilder, 0);
    return node;
}
exports.elementOpenEnd = elementOpenEnd;
/**
 * @param {(string|!tsickle_types_6.ElementConstructor)} nameOrCtor The Element's tag or constructor.
 * @param {(undefined|null|string|number)=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {(undefined|null|!Array<*>)=} statics An array of attribute name/value pairs of the static
 *     attributes for the Element. Attributes will only be set once when the
 *     Element is created.
 * @param {...?} varArgs
 * @return {!HTMLElement} The corresponding Element.
 */
function elementOpen(nameOrCtor, key, 
// Ideally we could tag statics and varArgs as an array where every odd
// element is a string and every even element is any, but this is hard.
statics, ...varArgs) {
    if (global_1.DEBUG) {
        assertions_1.assertNotInAttributes("elementOpen");
        assertions_1.assertNotInSkip("elementOpen");
    }
    elementOpenStart(nameOrCtor, key, statics);
    for (let i = ATTRIBUTES_OFFSET; i < arguments.length; i += 2) {
        attr(arguments[i], arguments[i + 1]);
    }
    return elementOpenEnd();
}
exports.elementOpen = elementOpen;
/**
 * Applies the currently buffered attrs to the currently open element. This
 * clears the buffered attributes.
 * @param {!tsickle_types_6.AttrMutatorConfig=} attrs The attributes.
 * @return {void}
 */
function applyAttrs(attrs = attributes_1.attributes) {
    /** @type {!Element} */
    const node = core_1.currentElement();
    /** @type {!tsickle_node_data_5.NodeData} */
    const data = node_data_1.getData(node);
    diffAttrs(node, data, attrs);
}
exports.applyAttrs = applyAttrs;
/**
 * Applies the current static attributes to the currently open element. Note:
 * statics should be applied before calling `applyAtrs`.
 * @param {(undefined|null|!Array<*>)} statics The statics to apply to the current element.
 * @param {!tsickle_types_6.AttrMutatorConfig=} attrs The attributes.
 * @return {void}
 */
function applyStatics(statics, attrs = attributes_1.attributes) {
    /** @type {!Element} */
    const node = core_1.currentElement();
    /** @type {!tsickle_node_data_5.NodeData} */
    const data = node_data_1.getData(node);
    diffStatics(node, data, statics, attrs);
}
exports.applyStatics = applyStatics;
/**
 * Closes an open virtual Element.
 *
 * @param {(string|!tsickle_types_6.ElementConstructor)} nameOrCtor The Element's tag or constructor.
 * @return {!Element} The corresponding Element.
 */
function elementClose(nameOrCtor) {
    if (global_1.DEBUG) {
        assertions_1.assertNotInAttributes("elementClose");
    }
    /** @type {!Element} */
    const node = core_1.close();
    if (global_1.DEBUG) {
        assertions_1.assertCloseMatchesOpenTag(node_data_1.getData(node).nameOrCtor, nameOrCtor);
    }
    return node;
}
exports.elementClose = elementClose;
/**
 * Declares a virtual Element at the current location in the document that has
 * no children.
 * @param {(string|!tsickle_types_6.ElementConstructor)} nameOrCtor The Element's tag or constructor.
 * @param {(undefined|null|string|number)=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {(undefined|null|!Array<*>)=} statics An array of attribute name/value pairs of the static
 *     attributes for the Element. Attributes will only be set once when the
 *     Element is created.
 * @param {...?} varArgs Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
function elementVoid(nameOrCtor, key, 
// Ideally we could tag statics and varArgs as an array where every odd
// element is a string and every even element is any, but this is hard.
statics, ...varArgs) {
    elementOpen.apply(null, (/** @type {?} */ (arguments)));
    return elementClose(nameOrCtor);
}
exports.elementVoid = elementVoid;
/**
 * Declares a virtual Text at this point in the document.
 *
 * @param {(string|number|boolean)} value The value of the Text.
 * @param {...function(*): string} varArgs
 *     Functions to format the value which are called only when the value has
 *     changed.
 * @return {!Text} The corresponding text node.
 */
function text(value, ...varArgs) {
    if (global_1.DEBUG) {
        assertions_1.assertNotInAttributes("text");
        assertions_1.assertNotInSkip("text");
    }
    /** @type {!Text} */
    const node = core_1.text();
    /** @type {!tsickle_node_data_5.NodeData} */
    const data = node_data_1.getData(node);
    if (data.text !== value) {
        data.text = (/** @type {string} */ (value));
        /** @type {(string|number|boolean)} */
        let formatted = value;
        for (let i = 1; i < arguments.length; i += 1) {
            /*
                   * Call the formatter function directly to prevent leaking arguments.
                   * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
                   */
            /** @type {?} */
            const fn = arguments[i];
            formatted = fn(formatted);
        }
        // Setting node.data resets the cursor in IE/Edge.
        if (node.data !== formatted) {
            node.data = (/** @type {string} */ (formatted));
        }
    }
    return node;
}
exports.text = text;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbF9lbGVtZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy92aXJ0dWFsX2VsZW1lbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLGtFQVFzQjtBQUN0QixrRUFBMkQ7QUFDM0Qsc0RBT2dCO0FBQ2hCLDBEQUFpQztBQUNqQyxnRUFBZ0Q7QUFFaEQsc0RBQWtEO0FBQ2xELHNEQUF1Qzs7Ozs7O01BTWpDLGlCQUFpQixHQUFHLENBQUM7Ozs7Ozs7O01BUXJCLFlBQVksR0FBRyxnQkFBUyxFQUFFOzs7Ozs7O0FBT2hDLFNBQVMsU0FBUyxDQUFDLE9BQWdCLEVBQUUsSUFBYyxFQUFFLEtBQXdCOztVQUNyRSxZQUFZLEdBQUcsc0JBQWUsRUFBRTs7VUFDaEMsWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztJQUUxRCxvQkFBYSxDQUNYLFlBQVksRUFDWixZQUFZLEVBQ1osT0FBTyxFQUNQLDRCQUFlLEVBQ2YsS0FBSyxFQUNMLElBQUksQ0FBQyxvQkFBb0IsQ0FDMUIsQ0FBQztJQUNGLG9CQUFhLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7Ozs7Ozs7Ozs7QUFVRCxTQUFTLFdBQVcsQ0FDbEIsSUFBYSxFQUNiLElBQWMsRUFDZCxPQUFnQixFQUNoQixLQUF3QjtJQUV4QixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7UUFDdkIsT0FBTztLQUNSO0lBRUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFFM0IsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDL0IsT0FBTztLQUNSO0lBRUQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTtRQUMzQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1B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QkFLdEMsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsU0FBUyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUMzQjtRQUVELGtEQUFrRDtRQUNsRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsd0JBQUEsU0FBUyxFQUFVLENBQUM7U0FDakM7S0FDRjtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVdDLG9CQUFJIiwic291cmNlc0NvbnRlbnQiOlsiLy8gIENvcHlyaWdodCAyMDE4IFRoZSBJbmNyZW1lbnRhbCBET00gQXV0aG9ycy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8qKiBAbGljZW5zZSBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMCAqL1xuXG5pbXBvcnQge1xuICBhc3NlcnQsXG4gIGFzc2VydENsb3NlTWF0Y2hlc09wZW5UYWcsXG4gIGFzc2VydEluQXR0cmlidXRlcyxcbiAgYXNzZXJ0SW5QYXRjaCxcbiAgYXNzZXJ0Tm90SW5BdHRyaWJ1dGVzLFxuICBhc3NlcnROb3RJblNraXAsXG4gIHNldEluQXR0cmlidXRlc1xufSBmcm9tIFwiLi9hc3NlcnRpb25zXCI7XG5pbXBvcnQgeyBhdHRyaWJ1dGVzLCB1cGRhdGVBdHRyaWJ1dGUgfSBmcm9tIFwiLi9hdHRyaWJ1dGVzXCI7XG5pbXBvcnQge1xuICBnZXRBcmdzQnVpbGRlcixcbiAgZ2V0QXR0cnNCdWlsZGVyLFxuICBjbG9zZSxcbiAgb3BlbixcbiAgdGV4dCBhcyBjb3JlVGV4dCxcbiAgY3VycmVudEVsZW1lbnRcbn0gZnJvbSBcIi4vY29yZVwiO1xuaW1wb3J0IHsgREVCVUcgfSBmcm9tIFwiLi9nbG9iYWxcIjtcbmltcG9ydCB7IGdldERhdGEsIE5vZGVEYXRhIH0gZnJvbSBcIi4vbm9kZV9kYXRhXCI7XG5pbXBvcnQgeyBBdHRyTXV0YXRvckNvbmZpZywgS2V5LCBOYW1lT3JDdG9yRGVmLCBTdGF0aWNzIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IGNyZWF0ZU1hcCwgdHJ1bmNhdGVBcnJheSB9IGZyb20gXCIuL3V0aWxcIjtcbmltcG9ydCB7IGNhbGN1bGF0ZURpZmYgfSBmcm9tIFwiLi9kaWZmXCI7XG5cbi8qKlxuICogVGhlIG9mZnNldCBpbiB0aGUgdmlydHVhbCBlbGVtZW50IGRlY2xhcmF0aW9uIHdoZXJlIHRoZSBhdHRyaWJ1dGVzIGFyZVxuICogc3BlY2lmaWVkLlxuICovXG5jb25zdCBBVFRSSUJVVEVTX09GRlNFVCA9IDM7XG5cbi8qKlxuICogVXNlZCB0byBrZWVwIHRyYWNrIG9mIHRoZSBwcmV2aW91cyB2YWx1ZXMgd2hlbiBhIDItd2F5IGRpZmYgaXMgbmVjZXNzYXJ5LlxuICogVGhpcyBvYmplY3QgaXMgcmV1c2VkLlxuICogVE9ETyhzcGFyaGFtSSkgU2NvcGUgdGhpcyB0byBhIHBhdGNoIHNvIHlvdSBjYW4gY2FsbCBwYXRjaCBmcm9tIGFuIGF0dHJpYnV0ZVxuICogdXBkYXRlLlxuICovXG5jb25zdCBwcmV2QXR0cnNNYXAgPSBjcmVhdGVNYXAoKTtcblxuLyoqXG4gKiBAcGFyYW0gZWxlbWVudCBUaGUgRWxlbWVudCB0byBkaWZmIHRoZSBhdHRycyBmb3IuXG4gKiBAcGFyYW0gZGF0YSBUaGUgTm9kZURhdGEgYXNzb2NpYXRlZCB3aXRoIHRoZSBFbGVtZW50LlxuICogQHBhcmFtIGF0dHJzIFRoZSBhdHRyaWJ1dGUgbWFwIG9mIG11dGF0b3JzXG4gKi9cbmZ1bmN0aW9uIGRpZmZBdHRycyhlbGVtZW50OiBFbGVtZW50LCBkYXRhOiBOb2RlRGF0YSwgYXR0cnM6IEF0dHJNdXRhdG9yQ29uZmlnKSB7XG4gIGNvbnN0IGF0dHJzQnVpbGRlciA9IGdldEF0dHJzQnVpbGRlcigpO1xuICBjb25zdCBwcmV2QXR0cnNBcnIgPSBkYXRhLmdldEF0dHJzQXJyKGF0dHJzQnVpbGRlci5sZW5ndGgpO1xuXG4gIGNhbGN1bGF0ZURpZmYoXG4gICAgcHJldkF0dHJzQXJyLFxuICAgIGF0dHJzQnVpbGRlcixcbiAgICBlbGVtZW50LFxuICAgIHVwZGF0ZUF0dHJpYnV0ZSxcbiAgICBhdHRycyxcbiAgICBkYXRhLmFsd2F5c0RpZmZBdHRyaWJ1dGVzXG4gICk7XG4gIHRydW5jYXRlQXJyYXkoYXR0cnNCdWlsZGVyLCAwKTtcbn1cblxuLyoqXG4gKiBBcHBsaWVzIHRoZSBzdGF0aWNzLiBXaGVuIGltcG9ydGluZyBhbiBFbGVtZW50LCBhbnkgZXhpc3RpbmcgYXR0cmlidXRlcyB0aGF0XG4gKiBtYXRjaCBhIHN0YXRpYyBhcmUgY29udmVydGVkIGludG8gYSBzdGF0aWMgYXR0cmlidXRlLlxuICogQHBhcmFtIG5vZGUgVGhlIEVsZW1lbnQgdG8gYXBwbHkgc3RhdGljcyBmb3IuXG4gKiBAcGFyYW0gZGF0YSBUaGUgTm9kZURhdGEgYXNzb2NpYXRlZCB3aXRoIHRoZSBFbGVtZW50LlxuICogQHBhcmFtIHN0YXRpY3MgVGhlIHN0YXRpY3MgYXJyYXkuXG4gKiBAcGFyYW0gYXR0cnMgVGhlIGF0dHJpYnV0ZSBtYXAgb2YgbXV0YXRvcnMuXG4gKi9cbmZ1bmN0aW9uIGRpZmZTdGF0aWNzKFxuICBub2RlOiBFbGVtZW50LFxuICBkYXRhOiBOb2RlRGF0YSxcbiAgc3RhdGljczogU3RhdGljcyxcbiAgYXR0cnM6IEF0dHJNdXRhdG9yQ29uZmlnXG4pIHtcbiAgaWYgKGRhdGEuc3RhdGljc0FwcGxpZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBkYXRhLnN0YXRpY3NBcHBsaWVkID0gdHJ1ZTtcblxuICBpZiAoIXN0YXRpY3MgfHwgIXN0YXRpY3MubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGRhdGEuaGFzRW1wdHlBdHRyc0FycigpKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0aWNzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICB1cGRhdGVBdHRyaWJ1dGUobm9kZSwgc3RhdGljc1tpXSBhcyBzdHJpbmcsIHN0YXRpY3NbaSArIDFdLCBhdHRycyk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdGljcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHByZXZBdHRyc01hcFtzdGF0aWNzW2ldIGFzIHN0cmluZ10gPSBpICsgMTtcbiAgfVxuXG4gIGNvbnN0IGF0dHJzQXJyID0gZGF0YS5nZXRBdHRyc0FycigwKTtcbiAgbGV0IGogPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJzQXJyLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgY29uc3QgbmFtZSA9IGF0dHJzQXJyW2ldO1xuICAgIGNvbnN0IHZhbHVlID0gYXR0cnNBcnJbaSArIDFdO1xuICAgIGNvbnN0IHN0YXRpY3NJbmRleCA9IHByZXZBdHRyc01hcFtuYW1lXTtcblxuICAgIGlmIChzdGF0aWNzSW5kZXgpIHtcbiAgICAgIC8vIEZvciBhbnkgYXR0cnMgdGhhdCBhcmUgc3RhdGljIGFuZCBoYXZlIHRoZSBzYW1lIHZhbHVlLCBtYWtlIHN1cmUgd2UgZG9cbiAgICAgIC8vIG5vdCBzZXQgdGhlbSBhZ2Fpbi5cbiAgICAgIGlmIChzdGF0aWNzW3N0YXRpY3NJbmRleF0gPT09IHZhbHVlKSB7XG4gICAgICAgIGRlbGV0ZSBwcmV2QXR0cnNNYXBbbmFtZV07XG4gICAgICB9XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIEZvciBhbnkgYXR0cnMgdGhhdCBhcmUgZHluYW1pYywgbW92ZSB0aGVtIHVwIHRvIHRoZSByaWdodCBwbGFjZS5cbiAgICBhdHRyc0FycltqXSA9IG5hbWU7XG4gICAgYXR0cnNBcnJbaiArIDFdID0gdmFsdWU7XG4gICAgaiArPSAyO1xuICB9XG4gIC8vIEFueXRoaW5nIGFmdGVyIGBqYCB3YXMgZWl0aGVyIG1vdmVkIHVwIGFscmVhZHkgb3Igc3RhdGljLlxuICB0cnVuY2F0ZUFycmF5KGF0dHJzQXJyLCBqKTtcblxuICBmb3IgKGNvbnN0IG5hbWUgaW4gcHJldkF0dHJzTWFwKSB7XG4gICAgdXBkYXRlQXR0cmlidXRlKG5vZGUsIG5hbWUsIHN0YXRpY3NbcHJldkF0dHJzTWFwW25hbWVdXSwgYXR0cnMpO1xuICAgIGRlbGV0ZSBwcmV2QXR0cnNNYXBbbmFtZV07XG4gIH1cbn1cblxuLyoqXG4gKiBEZWNsYXJlcyBhIHZpcnR1YWwgRWxlbWVudCBhdCB0aGUgY3VycmVudCBsb2NhdGlvbiBpbiB0aGUgZG9jdW1lbnQuIFRoaXNcbiAqIGNvcnJlc3BvbmRzIHRvIGFuIG9wZW5pbmcgdGFnIGFuZCBhIGVsZW1lbnRDbG9zZSB0YWcgaXMgcmVxdWlyZWQuIFRoaXMgaXNcbiAqIGxpa2UgZWxlbWVudE9wZW4sIGJ1dCB0aGUgYXR0cmlidXRlcyBhcmUgZGVmaW5lZCB1c2luZyB0aGUgYXR0ciBmdW5jdGlvblxuICogcmF0aGVyIHRoYW4gYmVpbmcgcGFzc2VkIGFzIGFyZ3VtZW50cy4gTXVzdCBiZSBmb2xsbG93ZWQgYnkgMCBvciBtb3JlIGNhbGxzXG4gKiB0byBhdHRyLCB0aGVuIGEgY2FsbCB0byBlbGVtZW50T3BlbkVuZC5cbiAqIEBwYXJhbSBuYW1lT3JDdG9yIFRoZSBFbGVtZW50J3MgdGFnIG9yIGNvbnN0cnVjdG9yLlxuICogQHBhcmFtIGtleSBUaGUga2V5IHVzZWQgdG8gaWRlbnRpZnkgdGhpcyBlbGVtZW50LiBUaGlzIGNhbiBiZSBhblxuICogICAgIGVtcHR5IHN0cmluZywgYnV0IHBlcmZvcm1hbmNlIG1heSBiZSBiZXR0ZXIgaWYgYSB1bmlxdWUgdmFsdWUgaXMgdXNlZFxuICogICAgIHdoZW4gaXRlcmF0aW5nIG92ZXIgYW4gYXJyYXkgb2YgaXRlbXMuXG4gKiBAcGFyYW0gc3RhdGljcyBBbiBhcnJheSBvZiBhdHRyaWJ1dGUgbmFtZS92YWx1ZSBwYWlycyBvZiB0aGUgc3RhdGljXG4gKiAgICAgYXR0cmlidXRlcyBmb3IgdGhlIEVsZW1lbnQuIEF0dHJpYnV0ZXMgd2lsbCBvbmx5IGJlIHNldCBvbmNlIHdoZW4gdGhlXG4gKiAgICAgRWxlbWVudCBpcyBjcmVhdGVkLlxuICovXG5mdW5jdGlvbiBlbGVtZW50T3BlblN0YXJ0KFxuICBuYW1lT3JDdG9yOiBOYW1lT3JDdG9yRGVmLFxuICBrZXk/OiBLZXksXG4gIHN0YXRpY3M/OiBTdGF0aWNzXG4pIHtcbiAgY29uc3QgYXJnc0J1aWxkZXIgPSBnZXRBcmdzQnVpbGRlcigpO1xuXG4gIGlmIChERUJVRykge1xuICAgIGFzc2VydE5vdEluQXR0cmlidXRlcyhcImVsZW1lbnRPcGVuU3RhcnRcIik7XG4gICAgc2V0SW5BdHRyaWJ1dGVzKHRydWUpO1xuICB9XG5cbiAgYXJnc0J1aWxkZXJbMF0gPSBuYW1lT3JDdG9yO1xuICBhcmdzQnVpbGRlclsxXSA9IGtleTtcbiAgYXJnc0J1aWxkZXJbMl0gPSBzdGF0aWNzO1xufVxuXG4vKipcbiAqIEFsbG93cyB5b3UgdG8gZGVmaW5lIGEga2V5IGFmdGVyIGFuIGVsZW1lbnRPcGVuU3RhcnQuIFRoaXMgaXMgdXNlZnVsIGluXG4gKiB0ZW1wbGF0ZXMgdGhhdCBkZWZpbmUga2V5IGFmdGVyIGFuIGVsZW1lbnQgaGFzIGJlZW4gb3BlbmVkIGllXG4gKiBgPGRpdiBrZXkoJ2ZvbycpPjwvZGl2PmAuXG4gKiBAcGFyYW0ga2V5IFRoZSBrZXkgdG8gdXNlIGZvciB0aGUgbmV4dCBjYWxsLlxuICovXG5mdW5jdGlvbiBrZXkoa2V5OiBzdHJpbmcpIHtcbiAgY29uc3QgYXJnc0J1aWxkZXIgPSBnZXRBcmdzQnVpbGRlcigpO1xuXG4gIGlmIChERUJVRykge1xuICAgIGFzc2VydEluQXR0cmlidXRlcyhcImtleVwiKTtcbiAgICBhc3NlcnQoYXJnc0J1aWxkZXIpO1xuICB9XG4gIGFyZ3NCdWlsZGVyWzFdID0ga2V5O1xufVxuXG4vKipcbiAqIEJ1ZmZlcnMgYW4gYXR0cmlidXRlLCB3aGljaCB3aWxsIGdldCBhcHBsaWVkIGR1cmluZyB0aGUgbmV4dCBjYWxsIHRvXG4gKiBgZWxlbWVudE9wZW5gLCBgZWxlbWVudE9wZW5FbmRgIG9yIGBhcHBseUF0dHJzYC5cbiAqIEBwYXJhbSBuYW1lIFRoZSBvZiB0aGUgYXR0cmlidXRlIHRvIGJ1ZmZlci5cbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZSB0byBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGF0dHIobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gIGNvbnN0IGF0dHJzQnVpbGRlciA9IGdldEF0dHJzQnVpbGRlcigpO1xuXG4gIGlmIChERUJVRykge1xuICAgIGFzc2VydEluUGF0Y2goXCJhdHRyXCIpO1xuICB9XG5cbiAgYXR0cnNCdWlsZGVyLnB1c2gobmFtZSk7XG4gIGF0dHJzQnVpbGRlci5wdXNoKHZhbHVlKTtcbn1cblxuLyoqIEByZXR1cm4gVGhlIHZhbHVlIG9mIHRoZSBub25jZSBhdHRyaWJ1dGUuICovXG5mdW5jdGlvbiBnZXROb25jZSgpOiBzdHJpbmcge1xuICBjb25zdCBhcmdzQnVpbGRlciA9IGdldEFyZ3NCdWlsZGVyKCk7XG4gIGNvbnN0IHN0YXRpY3MgPSA8U3RhdGljcz5hcmdzQnVpbGRlclsyXTtcbiAgaWYgKHN0YXRpY3MpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXRpY3MubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIGlmIChzdGF0aWNzW2ldID09PSBcIm5vbmNlXCIpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRpY3NbaSArIDFdIGFzIHN0cmluZztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIFwiXCI7XG59XG5cbi8qKlxuICogQ2xvc2VzIGFuIG9wZW4gdGFnIHN0YXJ0ZWQgd2l0aCBlbGVtZW50T3BlblN0YXJ0LlxuICogQHJldHVybiBUaGUgY29ycmVzcG9uZGluZyBFbGVtZW50LlxuICovXG5mdW5jdGlvbiBlbGVtZW50T3BlbkVuZCgpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGFyZ3NCdWlsZGVyID0gZ2V0QXJnc0J1aWxkZXIoKTtcblxuICBpZiAoREVCVUcpIHtcbiAgICBhc3NlcnRJbkF0dHJpYnV0ZXMoXCJlbGVtZW50T3BlbkVuZFwiKTtcbiAgICBzZXRJbkF0dHJpYnV0ZXMoZmFsc2UpO1xuICB9XG5cbiAgY29uc3Qgbm9kZSA9IG9wZW4oXG4gICAgPE5hbWVPckN0b3JEZWY+YXJnc0J1aWxkZXJbMF0sXG4gICAgPEtleT5hcmdzQnVpbGRlclsxXSxcbiAgICBnZXROb25jZSgpXG4gICk7XG4gIGNvbnN0IGRhdGEgPSBnZXREYXRhKG5vZGUpO1xuXG4gIGRpZmZTdGF0aWNzKG5vZGUsIGRhdGEsIDxTdGF0aWNzPmFyZ3NCdWlsZGVyWzJdLCBhdHRyaWJ1dGVzKTtcbiAgZGlmZkF0dHJzKG5vZGUsIGRhdGEsIGF0dHJpYnV0ZXMpO1xuICB0cnVuY2F0ZUFycmF5KGFyZ3NCdWlsZGVyLCAwKTtcblxuICByZXR1cm4gbm9kZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gIG5hbWVPckN0b3IgVGhlIEVsZW1lbnQncyB0YWcgb3IgY29uc3RydWN0b3IuXG4gKiBAcGFyYW0gIGtleSBUaGUga2V5IHVzZWQgdG8gaWRlbnRpZnkgdGhpcyBlbGVtZW50LiBUaGlzIGNhbiBiZSBhblxuICogICAgIGVtcHR5IHN0cmluZywgYnV0IHBlcmZvcm1hbmNlIG1heSBiZSBiZXR0ZXIgaWYgYSB1bmlxdWUgdmFsdWUgaXMgdXNlZFxuICogICAgIHdoZW4gaXRlcmF0aW5nIG92ZXIgYW4gYXJyYXkgb2YgaXRlbXMuXG4gKiBAcGFyYW0gc3RhdGljcyBBbiBhcnJheSBvZiBhdHRyaWJ1dGUgbmFtZS92YWx1ZSBwYWlycyBvZiB0aGUgc3RhdGljXG4gKiAgICAgYXR0cmlidXRlcyBmb3IgdGhlIEVsZW1lbnQuIEF0dHJpYnV0ZXMgd2lsbCBvbmx5IGJlIHNldCBvbmNlIHdoZW4gdGhlXG4gKiAgICAgRWxlbWVudCBpcyBjcmVhdGVkLlxuICogQHBhcmFtIHZhckFyZ3MsIEF0dHJpYnV0ZSBuYW1lL3ZhbHVlIHBhaXJzIG9mIHRoZSBkeW5hbWljIGF0dHJpYnV0ZXNcbiAqICAgICBmb3IgdGhlIEVsZW1lbnQuXG4gKiBAcmV0dXJuIFRoZSBjb3JyZXNwb25kaW5nIEVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGVsZW1lbnRPcGVuKFxuICBuYW1lT3JDdG9yOiBOYW1lT3JDdG9yRGVmLFxuICBrZXk/OiBLZXksXG4gIC8vIElkZWFsbHkgd2UgY291bGQgdGFnIHN0YXRpY3MgYW5kIHZhckFyZ3MgYXMgYW4gYXJyYXkgd2hlcmUgZXZlcnkgb2RkXG4gIC8vIGVsZW1lbnQgaXMgYSBzdHJpbmcgYW5kIGV2ZXJ5IGV2ZW4gZWxlbWVudCBpcyBhbnksIGJ1dCB0aGlzIGlzIGhhcmQuXG4gIHN0YXRpY3M/OiBTdGF0aWNzLFxuICAuLi52YXJBcmdzOiBBcnJheTxhbnk+XG4pIHtcbiAgaWYgKERFQlVHKSB7XG4gICAgYXNzZXJ0Tm90SW5BdHRyaWJ1dGVzKFwiZWxlbWVudE9wZW5cIik7XG4gICAgYXNzZXJ0Tm90SW5Ta2lwKFwiZWxlbWVudE9wZW5cIik7XG4gIH1cblxuICBlbGVtZW50T3BlblN0YXJ0KG5hbWVPckN0b3IsIGtleSwgc3RhdGljcyk7XG5cbiAgZm9yIChsZXQgaSA9IEFUVFJJQlVURVNfT0ZGU0VUOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgYXR0cihhcmd1bWVudHNbaV0sIGFyZ3VtZW50c1tpICsgMV0pO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRPcGVuRW5kKCk7XG59XG5cbi8qKlxuICogQXBwbGllcyB0aGUgY3VycmVudGx5IGJ1ZmZlcmVkIGF0dHJzIHRvIHRoZSBjdXJyZW50bHkgb3BlbiBlbGVtZW50LiBUaGlzXG4gKiBjbGVhcnMgdGhlIGJ1ZmZlcmVkIGF0dHJpYnV0ZXMuXG4gKiBAcGFyYW0gYXR0cnMgVGhlIGF0dHJpYnV0ZXMuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5QXR0cnMoYXR0cnMgPSBhdHRyaWJ1dGVzKSB7XG4gIGNvbnN0IG5vZGUgPSBjdXJyZW50RWxlbWVudCgpO1xuICBjb25zdCBkYXRhID0gZ2V0RGF0YShub2RlKTtcblxuICBkaWZmQXR0cnMobm9kZSwgZGF0YSwgYXR0cnMpO1xufVxuXG4vKipcbiAqIEFwcGxpZXMgdGhlIGN1cnJlbnQgc3RhdGljIGF0dHJpYnV0ZXMgdG8gdGhlIGN1cnJlbnRseSBvcGVuIGVsZW1lbnQuIE5vdGU6XG4gKiBzdGF0aWNzIHNob3VsZCBiZSBhcHBsaWVkIGJlZm9yZSBjYWxsaW5nIGBhcHBseUF0cnNgLlxuICogQHBhcmFtIHN0YXRpY3MgVGhlIHN0YXRpY3MgdG8gYXBwbHkgdG8gdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAqIEBwYXJhbSBhdHRycyBUaGUgYXR0cmlidXRlcy5cbiAqL1xuZnVuY3Rpb24gYXBwbHlTdGF0aWNzKHN0YXRpY3M6IFN0YXRpY3MsIGF0dHJzID0gYXR0cmlidXRlcykge1xuICBjb25zdCBub2RlID0gY3VycmVudEVsZW1lbnQoKTtcbiAgY29uc3QgZGF0YSA9IGdldERhdGEobm9kZSk7XG5cbiAgZGlmZlN0YXRpY3Mobm9kZSwgZGF0YSwgc3RhdGljcywgYXR0cnMpO1xufVxuXG4vKipcbiAqIENsb3NlcyBhbiBvcGVuIHZpcnR1YWwgRWxlbWVudC5cbiAqXG4gKiBAcGFyYW0gbmFtZU9yQ3RvciBUaGUgRWxlbWVudCdzIHRhZyBvciBjb25zdHJ1Y3Rvci5cbiAqIEByZXR1cm4gVGhlIGNvcnJlc3BvbmRpbmcgRWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gZWxlbWVudENsb3NlKG5hbWVPckN0b3I6IE5hbWVPckN0b3JEZWYpOiBFbGVtZW50IHtcbiAgaWYgKERFQlVHKSB7XG4gICAgYXNzZXJ0Tm90SW5BdHRyaWJ1dGVzKFwiZWxlbWVudENsb3NlXCIpO1xuICB9XG5cbiAgY29uc3Qgbm9kZSA9IGNsb3NlKCk7XG5cbiAgaWYgKERFQlVHKSB7XG4gICAgYXNzZXJ0Q2xvc2VNYXRjaGVzT3BlblRhZyhnZXREYXRhKG5vZGUpLm5hbWVPckN0b3IsIG5hbWVPckN0b3IpO1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbi8qKlxuICogRGVjbGFyZXMgYSB2aXJ0dWFsIEVsZW1lbnQgYXQgdGhlIGN1cnJlbnQgbG9jYXRpb24gaW4gdGhlIGRvY3VtZW50IHRoYXQgaGFzXG4gKiBubyBjaGlsZHJlbi5cbiAqIEBwYXJhbSBuYW1lT3JDdG9yIFRoZSBFbGVtZW50J3MgdGFnIG9yIGNvbnN0cnVjdG9yLlxuICogQHBhcmFtIGtleSBUaGUga2V5IHVzZWQgdG8gaWRlbnRpZnkgdGhpcyBlbGVtZW50LiBUaGlzIGNhbiBiZSBhblxuICogICAgIGVtcHR5IHN0cmluZywgYnV0IHBlcmZvcm1hbmNlIG1heSBiZSBiZXR0ZXIgaWYgYSB1bmlxdWUgdmFsdWUgaXMgdXNlZFxuICogICAgIHdoZW4gaXRlcmF0aW5nIG92ZXIgYW4gYXJyYXkgb2YgaXRlbXMuXG4gKiBAcGFyYW0gc3RhdGljcyBBbiBhcnJheSBvZiBhdHRyaWJ1dGUgbmFtZS92YWx1ZSBwYWlycyBvZiB0aGUgc3RhdGljXG4gKiAgICAgYXR0cmlidXRlcyBmb3IgdGhlIEVsZW1lbnQuIEF0dHJpYnV0ZXMgd2lsbCBvbmx5IGJlIHNldCBvbmNlIHdoZW4gdGhlXG4gKiAgICAgRWxlbWVudCBpcyBjcmVhdGVkLlxuICogQHBhcmFtIHZhckFyZ3MgQXR0cmlidXRlIG5hbWUvdmFsdWUgcGFpcnMgb2YgdGhlIGR5bmFtaWMgYXR0cmlidXRlc1xuICogICAgIGZvciB0aGUgRWxlbWVudC5cbiAqIEByZXR1cm4gVGhlIGNvcnJlc3BvbmRpbmcgRWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gZWxlbWVudFZvaWQoXG4gIG5hbWVPckN0b3I6IE5hbWVPckN0b3JEZWYsXG4gIGtleT86IEtleSxcbiAgLy8gSWRlYWxseSB3ZSBjb3VsZCB0YWcgc3RhdGljcyBhbmQgdmFyQXJncyBhcyBhbiBhcnJheSB3aGVyZSBldmVyeSBvZGRcbiAgLy8gZWxlbWVudCBpcyBhIHN0cmluZyBhbmQgZXZlcnkgZXZlbiBlbGVtZW50IGlzIGFueSwgYnV0IHRoaXMgaXMgaGFyZC5cbiAgc3RhdGljcz86IFN0YXRpY3MsXG4gIC4uLnZhckFyZ3M6IEFycmF5PGFueT5cbikge1xuICBlbGVtZW50T3Blbi5hcHBseShudWxsLCBhcmd1bWVudHMgYXMgYW55KTtcbiAgcmV0dXJuIGVsZW1lbnRDbG9zZShuYW1lT3JDdG9yKTtcbn1cblxuLyoqXG4gKiBEZWNsYXJlcyBhIHZpcnR1YWwgVGV4dCBhdCB0aGlzIHBvaW50IGluIHRoZSBkb2N1bWVudC5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBUZXh0LlxuICogQHBhcmFtIHZhckFyZ3NcbiAqICAgICBGdW5jdGlvbnMgdG8gZm9ybWF0IHRoZSB2YWx1ZSB3aGljaCBhcmUgY2FsbGVkIG9ubHkgd2hlbiB0aGUgdmFsdWUgaGFzXG4gKiAgICAgY2hhbmdlZC5cbiAqIEByZXR1cm4gVGhlIGNvcnJlc3BvbmRpbmcgdGV4dCBub2RlLlxuICovXG5mdW5jdGlvbiB0ZXh0KFxuICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbixcbiAgLi4udmFyQXJnczogQXJyYXk8KGE6IHt9KSA9PiBzdHJpbmc+XG4pIHtcbiAgaWYgKERFQlVHKSB7XG4gICAgYXNzZXJ0Tm90SW5BdHRyaWJ1dGVzKFwidGV4dFwiKTtcbiAgICBhc3NlcnROb3RJblNraXAoXCJ0ZXh0XCIpO1xuICB9XG5cbiAgY29uc3Qgbm9kZSA9IGNvcmVUZXh0KCk7XG4gIGNvbnN0IGRhdGEgPSBnZXREYXRhKG5vZGUpO1xuXG4gIGlmIChkYXRhLnRleHQgIT09IHZhbHVlKSB7XG4gICAgZGF0YS50ZXh0ID0gdmFsdWUgYXMgc3RyaW5nO1xuXG4gICAgbGV0IGZvcm1hdHRlZCA9IHZhbHVlO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAvKlxuICAgICAgICogQ2FsbCB0aGUgZm9ybWF0dGVyIGZ1bmN0aW9uIGRpcmVjdGx5IHRvIHByZXZlbnQgbGVha2luZyBhcmd1bWVudHMuXG4gICAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2luY3JlbWVudGFsLWRvbS9wdWxsLzIwNCNpc3N1ZWNvbW1lbnQtMTc4MjIzNTc0XG4gICAgICAgKi9cbiAgICAgIGNvbnN0IGZuID0gYXJndW1lbnRzW2ldO1xuICAgICAgZm9ybWF0dGVkID0gZm4oZm9ybWF0dGVkKTtcbiAgICB9XG5cbiAgICAvLyBTZXR0aW5nIG5vZGUuZGF0YSByZXNldHMgdGhlIGN1cnNvciBpbiBJRS9FZGdlLlxuICAgIGlmIChub2RlLmRhdGEgIT09IGZvcm1hdHRlZCkge1xuICAgICAgbm9kZS5kYXRhID0gZm9ybWF0dGVkIGFzIHN0cmluZztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn1cblxuLyoqICovXG5leHBvcnQge1xuICBhcHBseUF0dHJzLFxuICBhcHBseVN0YXRpY3MsXG4gIGVsZW1lbnRPcGVuU3RhcnQsXG4gIGVsZW1lbnRPcGVuRW5kLFxuICBlbGVtZW50T3BlbixcbiAgZWxlbWVudFZvaWQsXG4gIGVsZW1lbnRDbG9zZSxcbiAgdGV4dCxcbiAgYXR0cixcbiAga2V5XG59O1xuIl19