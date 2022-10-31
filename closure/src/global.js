/**
 * @fileoverview added by tsickle
 * Generated from: src/global.ts
 * @suppress {checkTypes,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
goog.module('incrementaldom.src.global');
var module = module || { id: 'src/global.js' };
goog.require('tslib');
const tsickle_debug_1 = goog.requireType("incrementaldom.src.debug");
//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */
/**
 * The name of the HTML attribute that holds the element key
 * (e.g. `<div key="foo">`). The attribute value, if it exists, is then used
 * as the default key when importing an element.
 * If null, no attribute value is used as the default key.
 * @type {(null|string)}
 */
let keyAttributeName = "key";
/**
 * @return {(null|string)}
 */
function getKeyAttributeName() {
    return keyAttributeName;
}
exports.getKeyAttributeName = getKeyAttributeName;
/**
 * @param {(null|string)} name
 * @return {void}
 */
function setKeyAttributeName(name) {
    keyAttributeName = name;
}
exports.setKeyAttributeName = setKeyAttributeName;
var debug_1 = goog.require('incrementaldom.src.debug');
exports.DEBUG = debug_1.DEBUG;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dsb2JhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFTSSxnQkFBZ0IsR0FBa0IsS0FBSzs7OztBQUUzQyxTQUFTLG1CQUFtQjtJQUMxQixPQUFPLGdCQUFnQixDQUFDO0FBQzFCLENBQUM7QUFPUSxrREFBbUI7Ozs7O0FBTDVCLFNBQVMsbUJBQW1CLENBQUMsSUFBbUI7SUFDOUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzFCLENBQUM7QUFHNkIsa0RBQW1CO0FBRGpELHdEQUFnQztBQUF2Qix3QkFBQSxLQUFLLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAgQ29weXJpZ2h0IDIwMTggVGhlIEluY3JlbWVudGFsIERPTSBBdXRob3JzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLyoqIEBsaWNlbnNlIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wICovXG5cbi8qKlxuICogVGhlIG5hbWUgb2YgdGhlIEhUTUwgYXR0cmlidXRlIHRoYXQgaG9sZHMgdGhlIGVsZW1lbnQga2V5XG4gKiAoZS5nLiBgPGRpdiBrZXk9XCJmb29cIj5gKS4gVGhlIGF0dHJpYnV0ZSB2YWx1ZSwgaWYgaXQgZXhpc3RzLCBpcyB0aGVuIHVzZWRcbiAqIGFzIHRoZSBkZWZhdWx0IGtleSB3aGVuIGltcG9ydGluZyBhbiBlbGVtZW50LlxuICogSWYgbnVsbCwgbm8gYXR0cmlidXRlIHZhbHVlIGlzIHVzZWQgYXMgdGhlIGRlZmF1bHQga2V5LlxuICovXG5sZXQga2V5QXR0cmlidXRlTmFtZTogc3RyaW5nIHwgbnVsbCA9IFwia2V5XCI7XG5cbmZ1bmN0aW9uIGdldEtleUF0dHJpYnV0ZU5hbWUoKSB7XG4gIHJldHVybiBrZXlBdHRyaWJ1dGVOYW1lO1xufVxuXG5mdW5jdGlvbiBzZXRLZXlBdHRyaWJ1dGVOYW1lKG5hbWU6IHN0cmluZyB8IG51bGwpIHtcbiAga2V5QXR0cmlidXRlTmFtZSA9IG5hbWU7XG59XG5cbmV4cG9ydCB7IERFQlVHIH0gZnJvbSBcIi4vZGVidWdcIjtcbmV4cG9ydCB7IGdldEtleUF0dHJpYnV0ZU5hbWUsIHNldEtleUF0dHJpYnV0ZU5hbWUgfTtcbiJdfQ==