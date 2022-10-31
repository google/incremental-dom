/**
 * @fileoverview added by tsickle
 * Generated from: src/attributes.ts
 * @suppress {checkTypes,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
goog.module('incrementaldom.src.attributes');
var module = module || { id: 'src/attributes.js' };
goog.require('tslib');
const tsickle_types_1 = goog.requireType("incrementaldom.src.types");
const tsickle_assertions_2 = goog.requireType("incrementaldom.src.assertions");
const tsickle_util_3 = goog.requireType("incrementaldom.src.util");
const tsickle_symbols_4 = goog.requireType("incrementaldom.src.symbols");
//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */
var assertions_1 = goog.require('incrementaldom.src.assertions');
var util_1 = goog.require('incrementaldom.src.util');
var symbols_1 = goog.require('incrementaldom.src.symbols');
/**
 * @param {string} name The name of the attribute. For example "tabindex" or
 *    "xlink:href".
 * @return {(null|string)} The namespace to use for the attribute, or null if there is
 * no namespace.
 */
function getNamespace(name) {
    if (name.lastIndexOf("xml:", 0) === 0) {
        return "http://www.w3.org/XML/1998/namespace";
    }
    if (name.lastIndexOf("xlink:", 0) === 0) {
        return "http://www.w3.org/1999/xlink";
    }
    return null;
}
/**
 * Applies an attribute or property to a given Element. If the value is null
 * or undefined, it is removed from the Element. Otherwise, the value is set
 * as an attribute.
 * @param {!Element} el The element to apply the attribute to.
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value.
 * @return {void}
 */
function applyAttr(el, name, value) {
    if (value == null) {
        el.removeAttribute(name);
    }
    else {
        /** @type {(null|string)} */
        const attrNS = getNamespace(name);
        if (attrNS) {
            el.setAttributeNS(attrNS, name, (/** @type {string} */ (value)));
        }
        else {
            el.setAttribute(name, (/** @type {string} */ (value)));
        }
    }
}
exports.applyAttr = applyAttr;
/**
 * Applies a property to a given Element.
 * @param {!Element} el The element to apply the property to.
 * @param {string} name The property's name.
 * @param {*} value The property's value.
 * @return {void}
 */
function applyProp(el, name, value) {
    ((/** @type {?} */ (el)))[name] = value;
}
exports.applyProp = applyProp;
/**
 * Applies a value to a style declaration. Supports CSS custom properties by
 * setting properties containing a dash using CSSStyleDeclaration.setProperty.
 * @param {!CSSStyleDeclaration} style A style declaration.
 * @param {string} prop The property to apply. This can be either camelcase or dash
 *    separated. For example: "backgroundColor" and "background-color" are both
 *    supported.
 * @param {string} value The value of the property.
 * @return {void}
 */
function setStyleValue(style, prop, value) {
    if (prop.indexOf("-") >= 0) {
        style.setProperty(prop, value);
    }
    else {
        ((/** @type {?} */ (style)))[prop] = value;
    }
}
/**
 * Applies a style to an Element. No vendor prefix expansion is done for
 * property names/values.
 * @param {!Element} el The Element to apply the style for.
 * @param {string} name The attribute's name.
 * @param {(string|!Object<string,string>)} style The style to set. Either a string of css or an object
 *     containing property-value pairs.
 * @return {void}
 */
function applyStyle(el, name, style) {
    // MathML elements inherit from Element, which does not have style. We cannot
    // do `instanceof HTMLElement` / `instanceof SVGElement`, since el can belong
    // to a different document, so just check that it has a style.
    assertions_1.assert("style" in el);
    /** @type {!CSSStyleDeclaration} */
    const elStyle = ((/** @type {(!HTMLElement|!SVGElement)} */ (el))).style;
    if (typeof style === "string") {
        elStyle.cssText = style;
    }
    else {
        elStyle.cssText = "";
        for (const prop in style) {
            if (util_1.has(style, prop)) {
                setStyleValue(elStyle, prop, style[prop]);
            }
        }
    }
}
/**
 * Updates a single attribute on an Element.
 * @param {!Element} el The Element to apply the attribute to.
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 * @return {void}
 */
function applyAttributeTyped(el, name, value) {
    /** @type {string} */
    const type = typeof value;
    if (type === "object" || type === "function") {
        applyProp(el, name, value);
    }
    else {
        applyAttr(el, name, value);
    }
}
/**
 * @return {!tsickle_types_1.AttrMutatorConfig}
 */
function createAttributeMap() {
    /** @type {!tsickle_types_1.AttrMutatorConfig} */
    const attributes = (/** @type {!tsickle_types_1.AttrMutatorConfig} */ (util_1.createMap()));
    // Special generic mutator that's called for any attribute that does not
    // have a specific mutator.
    attributes[symbols_1.symbols.default] = applyAttributeTyped;
    attributes["style"] = applyStyle;
    return attributes;
}
exports.createAttributeMap = createAttributeMap;
/**
 * A publicly mutable object to provide custom mutators for attributes.
 * NB: The result of createMap() has to be recast since closure compiler
 * will just assume attributes is "any" otherwise and throws away
 * the type annotation set by tsickle.
 * @type {!tsickle_types_1.AttrMutatorConfig}
 */
const attributes = createAttributeMap();
exports.attributes = attributes;
/**
 * Calls the appropriate attribute mutator for this attribute.
 * @param {!Element} el The Element to apply the attribute to.
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 * @param {!tsickle_types_1.AttrMutatorConfig} attrs The attribute map of mutators.
 * @return {void}
 */
function updateAttribute(el, name, value, attrs) {
    /** @type {function(!Element, string, ?): void} */
    const mutator = attrs[name] || attrs[symbols_1.symbols.default];
    mutator(el, name, value);
}
exports.updateAttribute = updateAttribute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0cmlidXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hdHRyaWJ1dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBSUEsa0VBQXNDO0FBQ3RDLHNEQUF3QztBQUN4Qyw0REFBb0M7Ozs7Ozs7QUFRcEMsU0FBUyxZQUFZLENBQUMsSUFBWTtJQUNoQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNyQyxPQUFPLHNDQUFzQyxDQUFDO0tBQy9DO0lBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDdkMsT0FBTyw4QkFBOEIsQ0FBQztLQUN2QztJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQzs7Ozs7Ozs7OztBQVVELFNBQVMsU0FBUyxDQUFDLEVBQVcsRUFBRSxJQUFZLEVBQUUsS0FBYztJQUMxRCxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDakIsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMxQjtTQUFNOztjQUNDLE1BQU0sR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO1FBQ2pDLElBQUksTUFBTSxFQUFFO1lBQ1YsRUFBRSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLHdCQUFBLEtBQUssRUFBVSxDQUFDLENBQUM7U0FDbEQ7YUFBTTtZQUNMLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLHdCQUFBLEtBQUssRUFBVSxDQUFDLENBQUM7U0FDeEM7S0FDRjtBQUNILENBQUM7QUE0SEMsOEJBQVM7Ozs7Ozs7O0FBcEhYLFNBQVMsU0FBUyxDQUFDLEVBQVcsRUFBRSxJQUFZLEVBQUUsS0FBYztJQUMxRCxDQUFDLG1CQUFBLEVBQUUsRUFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQzVCLENBQUM7QUFpSEMsOEJBQVM7Ozs7Ozs7Ozs7O0FBdEdYLFNBQVMsYUFBYSxDQUNwQixLQUEwQixFQUMxQixJQUFZLEVBQ1osS0FBYTtJQUViLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDMUIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDaEM7U0FBTTtRQUNMLENBQUMsbUJBQUEsS0FBSyxFQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDOUI7QUFDSCxDQUFDOzs7Ozs7Ozs7O0FBVUQsU0FBUyxVQUFVLENBQ2pCLEVBQVcsRUFDWCxJQUFZLEVBQ1osS0FBdUM7Ozs7SUFLdkMsbUJBQU0sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7O1VBQ2hCLE9BQU8sR0FBRyxDQUFDLDRDQUEwQixFQUFFLEVBQUEsQ0FBQyxDQUFDLEtBQUs7SUFFcEQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDN0IsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7S0FDekI7U0FBTTtRQUNMLE9BQU8sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBRXJCLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQ3hCLElBQUksVUFBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDcEIsYUFBYSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDM0M7U0FDRjtLQUNGO0FBQ0gsQ0FBQzs7Ozs7Ozs7OztBQVVELFNBQVMsbUJBQW1CLENBQUMsRUFBVyxFQUFFLElBQVksRUFBRSxLQUFjOztVQUM5RCxJQUFJLEdBQUcsT0FBTyxLQUFLO0lBRXpCLElBQUksSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLEtBQUssVUFBVSxFQUFFO1FBQzVDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzVCO1NBQU07UUFDTCxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM1QjtBQUNILENBQUM7Ozs7QUFFRCxTQUFTLGtCQUFrQjs7VUFDbkIsVUFBVSxHQUFzQixvREFBQSxnQkFBUyxFQUFFLEVBQXFCOzs7SUFHdEUsVUFBVSxDQUFDLGlCQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsbUJBQW1CLENBQUM7SUFFbEQsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUNqQyxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDO0FBOEJDLGdEQUFrQjs7Ozs7Ozs7TUF0QmQsVUFBVSxHQUFHLGtCQUFrQixFQUFFO0FBMEJyQyxnQ0FBVTs7Ozs7Ozs7Ozs7QUFmWixTQUFTLGVBQWUsQ0FDdEIsRUFBVyxFQUNYLElBQVksRUFDWixLQUFjLEVBQ2QsS0FBd0I7O1VBRWxCLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLGlCQUFPLENBQUMsT0FBTyxDQUFDO0lBQ3JELE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzNCLENBQUM7QUFJQywwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbIi8vICBDb3B5cmlnaHQgMjAxOCBUaGUgSW5jcmVtZW50YWwgRE9NIEF1dGhvcnMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vKiogQGxpY2Vuc2UgU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjAgKi9cblxuaW1wb3J0IHsgQXR0ck11dGF0b3JDb25maWcgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSBcIi4vYXNzZXJ0aW9uc1wiO1xuaW1wb3J0IHsgY3JlYXRlTWFwLCBoYXMgfSBmcm9tIFwiLi91dGlsXCI7XG5pbXBvcnQgeyBzeW1ib2xzIH0gZnJvbSBcIi4vc3ltYm9sc1wiO1xuXG4vKipcbiAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUuIEZvciBleGFtcGxlIFwidGFiaW5kZXhcIiBvclxuICogICAgXCJ4bGluazpocmVmXCIuXG4gKiBAcmV0dXJucyBUaGUgbmFtZXNwYWNlIHRvIHVzZSBmb3IgdGhlIGF0dHJpYnV0ZSwgb3IgbnVsbCBpZiB0aGVyZSBpc1xuICogbm8gbmFtZXNwYWNlLlxuICovXG5mdW5jdGlvbiBnZXROYW1lc3BhY2UobmFtZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmIChuYW1lLmxhc3RJbmRleE9mKFwieG1sOlwiLCAwKSA9PT0gMCkge1xuICAgIHJldHVybiBcImh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZVwiO1xuICB9XG5cbiAgaWYgKG5hbWUubGFzdEluZGV4T2YoXCJ4bGluazpcIiwgMCkgPT09IDApIHtcbiAgICByZXR1cm4gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBBcHBsaWVzIGFuIGF0dHJpYnV0ZSBvciBwcm9wZXJ0eSB0byBhIGdpdmVuIEVsZW1lbnQuIElmIHRoZSB2YWx1ZSBpcyBudWxsXG4gKiBvciB1bmRlZmluZWQsIGl0IGlzIHJlbW92ZWQgZnJvbSB0aGUgRWxlbWVudC4gT3RoZXJ3aXNlLCB0aGUgdmFsdWUgaXMgc2V0XG4gKiBhcyBhbiBhdHRyaWJ1dGUuXG4gKiBAcGFyYW0gZWwgVGhlIGVsZW1lbnQgdG8gYXBwbHkgdGhlIGF0dHJpYnV0ZSB0by5cbiAqIEBwYXJhbSBuYW1lIFRoZSBhdHRyaWJ1dGUncyBuYW1lLlxuICogQHBhcmFtIHZhbHVlIFRoZSBhdHRyaWJ1dGUncyB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYXBwbHlBdHRyKGVsOiBFbGVtZW50LCBuYW1lOiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGF0dHJOUyA9IGdldE5hbWVzcGFjZShuYW1lKTtcbiAgICBpZiAoYXR0ck5TKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyhhdHRyTlMsIG5hbWUsIHZhbHVlIGFzIHN0cmluZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSBhcyBzdHJpbmcpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFwcGxpZXMgYSBwcm9wZXJ0eSB0byBhIGdpdmVuIEVsZW1lbnQuXG4gKiBAcGFyYW0gZWwgVGhlIGVsZW1lbnQgdG8gYXBwbHkgdGhlIHByb3BlcnR5IHRvLlxuICogQHBhcmFtIG5hbWUgVGhlIHByb3BlcnR5J3MgbmFtZS5cbiAqIEBwYXJhbSB2YWx1ZSBUaGUgcHJvcGVydHkncyB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYXBwbHlQcm9wKGVsOiBFbGVtZW50LCBuYW1lOiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKSB7XG4gIChlbCBhcyBhbnkpW25hbWVdID0gdmFsdWU7XG59XG5cbi8qKlxuICogQXBwbGllcyBhIHZhbHVlIHRvIGEgc3R5bGUgZGVjbGFyYXRpb24uIFN1cHBvcnRzIENTUyBjdXN0b20gcHJvcGVydGllcyBieVxuICogc2V0dGluZyBwcm9wZXJ0aWVzIGNvbnRhaW5pbmcgYSBkYXNoIHVzaW5nIENTU1N0eWxlRGVjbGFyYXRpb24uc2V0UHJvcGVydHkuXG4gKiBAcGFyYW0gc3R5bGUgQSBzdHlsZSBkZWNsYXJhdGlvbi5cbiAqIEBwYXJhbSBwcm9wIFRoZSBwcm9wZXJ0eSB0byBhcHBseS4gVGhpcyBjYW4gYmUgZWl0aGVyIGNhbWVsY2FzZSBvciBkYXNoXG4gKiAgICBzZXBhcmF0ZWQuIEZvciBleGFtcGxlOiBcImJhY2tncm91bmRDb2xvclwiIGFuZCBcImJhY2tncm91bmQtY29sb3JcIiBhcmUgYm90aFxuICogICAgc3VwcG9ydGVkLlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkuXG4gKi9cbmZ1bmN0aW9uIHNldFN0eWxlVmFsdWUoXG4gIHN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uLFxuICBwcm9wOiBzdHJpbmcsXG4gIHZhbHVlOiBzdHJpbmdcbikge1xuICBpZiAocHJvcC5pbmRleE9mKFwiLVwiKSA+PSAwKSB7XG4gICAgc3R5bGUuc2V0UHJvcGVydHkocHJvcCwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIChzdHlsZSBhcyBhbnkpW3Byb3BdID0gdmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBBcHBsaWVzIGEgc3R5bGUgdG8gYW4gRWxlbWVudC4gTm8gdmVuZG9yIHByZWZpeCBleHBhbnNpb24gaXMgZG9uZSBmb3JcbiAqIHByb3BlcnR5IG5hbWVzL3ZhbHVlcy5cbiAqIEBwYXJhbSBlbCBUaGUgRWxlbWVudCB0byBhcHBseSB0aGUgc3R5bGUgZm9yLlxuICogQHBhcmFtIG5hbWUgVGhlIGF0dHJpYnV0ZSdzIG5hbWUuXG4gKiBAcGFyYW0gIHN0eWxlIFRoZSBzdHlsZSB0byBzZXQuIEVpdGhlciBhIHN0cmluZyBvZiBjc3Mgb3IgYW4gb2JqZWN0XG4gKiAgICAgY29udGFpbmluZyBwcm9wZXJ0eS12YWx1ZSBwYWlycy5cbiAqL1xuZnVuY3Rpb24gYXBwbHlTdHlsZShcbiAgZWw6IEVsZW1lbnQsXG4gIG5hbWU6IHN0cmluZyxcbiAgc3R5bGU6IHN0cmluZyB8IHsgW2s6IHN0cmluZ106IHN0cmluZyB9XG4pIHtcbiAgLy8gTWF0aE1MIGVsZW1lbnRzIGluaGVyaXQgZnJvbSBFbGVtZW50LCB3aGljaCBkb2VzIG5vdCBoYXZlIHN0eWxlLiBXZSBjYW5ub3RcbiAgLy8gZG8gYGluc3RhbmNlb2YgSFRNTEVsZW1lbnRgIC8gYGluc3RhbmNlb2YgU1ZHRWxlbWVudGAsIHNpbmNlIGVsIGNhbiBiZWxvbmdcbiAgLy8gdG8gYSBkaWZmZXJlbnQgZG9jdW1lbnQsIHNvIGp1c3QgY2hlY2sgdGhhdCBpdCBoYXMgYSBzdHlsZS5cbiAgYXNzZXJ0KFwic3R5bGVcIiBpbiBlbCk7XG4gIGNvbnN0IGVsU3R5bGUgPSAoPEhUTUxFbGVtZW50IHwgU1ZHRWxlbWVudD5lbCkuc3R5bGU7XG5cbiAgaWYgKHR5cGVvZiBzdHlsZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsU3R5bGUuY3NzVGV4dCA9IHN0eWxlO1xuICB9IGVsc2Uge1xuICAgIGVsU3R5bGUuY3NzVGV4dCA9IFwiXCI7XG5cbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gc3R5bGUpIHtcbiAgICAgIGlmIChoYXMoc3R5bGUsIHByb3ApKSB7XG4gICAgICAgIHNldFN0eWxlVmFsdWUoZWxTdHlsZSwgcHJvcCwgc3R5bGVbcHJvcF0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFVwZGF0ZXMgYSBzaW5nbGUgYXR0cmlidXRlIG9uIGFuIEVsZW1lbnQuXG4gKiBAcGFyYW0gZWwgVGhlIEVsZW1lbnQgdG8gYXBwbHkgdGhlIGF0dHJpYnV0ZSB0by5cbiAqIEBwYXJhbSBuYW1lIFRoZSBhdHRyaWJ1dGUncyBuYW1lLlxuICogQHBhcmFtIHZhbHVlIFRoZSBhdHRyaWJ1dGUncyB2YWx1ZS4gSWYgdGhlIHZhbHVlIGlzIGFuIG9iamVjdCBvclxuICogICAgIGZ1bmN0aW9uIGl0IGlzIHNldCBvbiB0aGUgRWxlbWVudCwgb3RoZXJ3aXNlLCBpdCBpcyBzZXQgYXMgYW4gSFRNTFxuICogICAgIGF0dHJpYnV0ZS5cbiAqL1xuZnVuY3Rpb24gYXBwbHlBdHRyaWJ1dGVUeXBlZChlbDogRWxlbWVudCwgbmFtZTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bikge1xuICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbHVlO1xuXG4gIGlmICh0eXBlID09PSBcIm9iamVjdFwiIHx8IHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGFwcGx5UHJvcChlbCwgbmFtZSwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGFwcGx5QXR0cihlbCwgbmFtZSwgdmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUF0dHJpYnV0ZU1hcCgpIHtcbiAgY29uc3QgYXR0cmlidXRlczogQXR0ck11dGF0b3JDb25maWcgPSBjcmVhdGVNYXAoKSBhcyBBdHRyTXV0YXRvckNvbmZpZztcbiAgLy8gU3BlY2lhbCBnZW5lcmljIG11dGF0b3IgdGhhdCdzIGNhbGxlZCBmb3IgYW55IGF0dHJpYnV0ZSB0aGF0IGRvZXMgbm90XG4gIC8vIGhhdmUgYSBzcGVjaWZpYyBtdXRhdG9yLlxuICBhdHRyaWJ1dGVzW3N5bWJvbHMuZGVmYXVsdF0gPSBhcHBseUF0dHJpYnV0ZVR5cGVkO1xuXG4gIGF0dHJpYnV0ZXNbXCJzdHlsZVwiXSA9IGFwcGx5U3R5bGU7XG4gIHJldHVybiBhdHRyaWJ1dGVzO1xufVxuXG4vKipcbiAqIEEgcHVibGljbHkgbXV0YWJsZSBvYmplY3QgdG8gcHJvdmlkZSBjdXN0b20gbXV0YXRvcnMgZm9yIGF0dHJpYnV0ZXMuXG4gKiBOQjogVGhlIHJlc3VsdCBvZiBjcmVhdGVNYXAoKSBoYXMgdG8gYmUgcmVjYXN0IHNpbmNlIGNsb3N1cmUgY29tcGlsZXJcbiAqIHdpbGwganVzdCBhc3N1bWUgYXR0cmlidXRlcyBpcyBcImFueVwiIG90aGVyd2lzZSBhbmQgdGhyb3dzIGF3YXlcbiAqIHRoZSB0eXBlIGFubm90YXRpb24gc2V0IGJ5IHRzaWNrbGUuXG4gKi9cbmNvbnN0IGF0dHJpYnV0ZXMgPSBjcmVhdGVBdHRyaWJ1dGVNYXAoKTtcblxuLyoqXG4gKiBDYWxscyB0aGUgYXBwcm9wcmlhdGUgYXR0cmlidXRlIG11dGF0b3IgZm9yIHRoaXMgYXR0cmlidXRlLlxuICogQHBhcmFtIGVsIFRoZSBFbGVtZW50IHRvIGFwcGx5IHRoZSBhdHRyaWJ1dGUgdG8uXG4gKiBAcGFyYW0gbmFtZSBUaGUgYXR0cmlidXRlJ3MgbmFtZS5cbiAqIEBwYXJhbSB2YWx1ZSBUaGUgYXR0cmlidXRlJ3MgdmFsdWUuIElmIHRoZSB2YWx1ZSBpcyBhbiBvYmplY3Qgb3JcbiAqICAgICBmdW5jdGlvbiBpdCBpcyBzZXQgb24gdGhlIEVsZW1lbnQsIG90aGVyd2lzZSwgaXQgaXMgc2V0IGFzIGFuIEhUTUxcbiAqICAgICBhdHRyaWJ1dGUuXG4gKiBAcGFyYW0gYXR0cnMgVGhlIGF0dHJpYnV0ZSBtYXAgb2YgbXV0YXRvcnMuXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZUF0dHJpYnV0ZShcbiAgZWw6IEVsZW1lbnQsXG4gIG5hbWU6IHN0cmluZyxcbiAgdmFsdWU6IHVua25vd24sXG4gIGF0dHJzOiBBdHRyTXV0YXRvckNvbmZpZ1xuKSB7XG4gIGNvbnN0IG11dGF0b3IgPSBhdHRyc1tuYW1lXSB8fCBhdHRyc1tzeW1ib2xzLmRlZmF1bHRdO1xuICBtdXRhdG9yKGVsLCBuYW1lLCB2YWx1ZSk7XG59XG5cbmV4cG9ydCB7XG4gIGNyZWF0ZUF0dHJpYnV0ZU1hcCxcbiAgdXBkYXRlQXR0cmlidXRlLFxuICBhcHBseVByb3AsXG4gIGFwcGx5QXR0cixcbiAgYXR0cmlidXRlc1xufTtcbiJdfQ==