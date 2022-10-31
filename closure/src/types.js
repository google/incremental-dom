/**
 * @fileoverview added by tsickle
 * Generated from: src/types.ts
 * @suppress {checkTypes,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */
goog.module('incrementaldom.src.types');
var module = module || { id: 'src/types.js' };
goog.require('tslib');
/**
 * @record
 */
function ElementConstructor() { }
exports.ElementConstructor = ElementConstructor;
/** @typedef {function(!Element, string, ?): void} */
exports.AttrMutator;
/**
 * @record
 */
function AttrMutatorConfig() { }
exports.AttrMutatorConfig = AttrMutatorConfig;
/** @typedef {(string|!ElementConstructor)} */
exports.NameOrCtorDef;
/** @typedef {(undefined|null|string|number)} */
exports.Key;
/** @typedef {(undefined|null|!Array<*>)} */
exports.Statics;
/** @typedef {function((!DocumentFragment|!Element), function((undefined|?)): void, (undefined|?)=): ?} */
exports.PatchFunction;
/** @typedef {function(!Node, (string|!ElementConstructor), (string|!ElementConstructor), (undefined|null|string|number), (undefined|null|string|number)): boolean} */
exports.MatchFnDef;
/**
 * @record
 */
function PatchConfig() { }
exports.PatchConfig = PatchConfig;
/* istanbul ignore if */
if (false) {
    /** @type {(undefined|function(!Node, (string|!ElementConstructor), (string|!ElementConstructor), (undefined|null|string|number), (undefined|null|string|number)): boolean)} */
    PatchConfig.prototype.matches;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUdBLGlDQUVDOzs7QUFFRCxvQkFBa0U7Ozs7QUFFbEUsZ0NBRUM7OztBQUVELHNCQUF3RDs7QUFFeEQsWUFBcUQ7O0FBRXJELGdCQUFtRDs7QUFFbkQsc0JBSU87O0FBRVAsbUJBTWE7Ozs7QUFFYiwwQkFFQzs7Ozs7SUFEQyw4QkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAgQ29weXJpZ2h0IDIwMTggVGhlIEluY3JlbWVudGFsIERPTSBBdXRob3JzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLyoqIEBsaWNlbnNlIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgRWxlbWVudENvbnN0cnVjdG9yIHtcbiAgbmV3ICgpOiBFbGVtZW50O1xufVxuXG5leHBvcnQgdHlwZSBBdHRyTXV0YXRvciA9IChhOiBFbGVtZW50LCBiOiBzdHJpbmcsIGM6IGFueSkgPT4gdm9pZDtcblxuZXhwb3J0IGludGVyZmFjZSBBdHRyTXV0YXRvckNvbmZpZyB7XG4gIFt4OiBzdHJpbmddOiBBdHRyTXV0YXRvcjtcbn1cblxuZXhwb3J0IHR5cGUgTmFtZU9yQ3RvckRlZiA9IHN0cmluZyB8IEVsZW1lbnRDb25zdHJ1Y3RvcjtcblxuZXhwb3J0IHR5cGUgS2V5ID0gc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IHR5cGUgU3RhdGljcyA9IEFycmF5PHt9PiB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB0eXBlIFBhdGNoRnVuY3Rpb248VCwgUj4gPSAoXG4gIG5vZGU6IEVsZW1lbnQgfCBEb2N1bWVudEZyYWdtZW50LFxuICB0ZW1wbGF0ZTogKGE6IFQgfCB1bmRlZmluZWQpID0+IHZvaWQsXG4gIGRhdGE/OiBUIHwgdW5kZWZpbmVkXG4pID0+IFI7XG5cbmV4cG9ydCB0eXBlIE1hdGNoRm5EZWYgPSAoXG4gIG1hdGNoTm9kZTogTm9kZSxcbiAgbmFtZU9yQ3RvcjogTmFtZU9yQ3RvckRlZixcbiAgZXhwZWN0ZWROYW1lT3JDdG9yOiBOYW1lT3JDdG9yRGVmLFxuICBrZXk6IEtleSxcbiAgZXhwZWN0ZWRLZXk6IEtleVxuKSA9PiBib29sZWFuO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBhdGNoQ29uZmlnIHtcbiAgbWF0Y2hlcz86IE1hdGNoRm5EZWY7XG59XG4iXX0=