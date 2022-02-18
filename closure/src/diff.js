/**
 * @fileoverview added by tsickle
 * Generated from: src/diff.ts
 * @suppress {checkTypes,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
goog.module('incrementaldom.src.diff');
var module = module || { id: 'src/diff.js' };
goog.require('tslib');
const tsickle_types_1 = goog.requireType("incrementaldom.src.types");
const tsickle_util_2 = goog.requireType("incrementaldom.src.util");
const tsickle_changes_3 = goog.requireType("incrementaldom.src.changes");
//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */
var util_1 = goog.require('incrementaldom.src.util');
var changes_1 = goog.require('incrementaldom.src.changes');
/**
 * Used to keep track of the previous values when a 2-way diff is necessary.
 * This object is cleared out and reused.
 * @type {?}
 */
const prevValuesMap = util_1.createMap();
/**
 * Calculates the diff between previous and next values, calling the update
 * function when an item has changed value. If an item from the previous values
 * is not present in the the next values, the update function is called with a
 * value of `undefined`.
 * @template T
 * @param {!Array<string>} prev The previous values, alternating name, value pairs.
 * @param {!Array<string>} next The next values, alternating name, value pairs.
 * @param {T} updateCtx The context for the updateFn.
 * @param {function(T, string, (undefined|*), !tsickle_types_1.AttrMutatorConfig): void} updateFn A function to call when a value has changed.
 * @param {!tsickle_types_1.AttrMutatorConfig} attrs Attribute map for mutators
 * @param {boolean=} alwaysDiffAttributes Whether to diff attributes unconditionally
 * @return {void}
 */
function calculateDiff(prev, next, updateCtx, updateFn, attrs, alwaysDiffAttributes = false) {
    /** @type {boolean} */
    const isNew = !prev.length || alwaysDiffAttributes;
    /** @type {number} */
    let i = 0;
    for (; i < next.length; i += 2) {
        /** @type {string} */
        const name = next[i];
        if (isNew) {
            prev[i] = name;
        }
        else if (prev[i] !== name) {
            break;
        }
        /** @type {string} */
        const value = next[i + 1];
        if (isNew || prev[i + 1] !== value) {
            prev[i + 1] = value;
            changes_1.queueChange(updateFn, updateCtx, name, value, attrs);
        }
    }
    // Items did not line up exactly as before, need to make sure old items are
    // removed. This should be a rare case.
    if (i < next.length || i < prev.length) {
        /** @type {number} */
        const startIndex = i;
        for (i = startIndex; i < prev.length; i += 2) {
            prevValuesMap[prev[i]] = prev[i + 1];
        }
        for (i = startIndex; i < next.length; i += 2) {
            /** @type {string} */
            const name = (/** @type {string} */ (next[i]));
            /** @type {string} */
            const value = next[i + 1];
            if (prevValuesMap[name] !== value) {
                changes_1.queueChange(updateFn, updateCtx, name, value, attrs);
            }
            prev[i] = name;
            prev[i + 1] = value;
            delete prevValuesMap[name];
        }
        util_1.truncateArray(prev, next.length);
        for (const name in prevValuesMap) {
            changes_1.queueChange(updateFn, updateCtx, name, undefined, attrs);
            delete prevValuesMap[name];
        }
    }
    changes_1.flush();
}
exports.calculateDiff = calculateDiff;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlmZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kaWZmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFJQSxzREFBa0Q7QUFDbEQsNERBQStDOzs7Ozs7TUFNekMsYUFBYSxHQUFHLGdCQUFTLEVBQUU7Ozs7Ozs7Ozs7Ozs7OztBQWNqQyxTQUFTLGFBQWEsQ0FDcEIsSUFBbUIsRUFDbkIsSUFBbUIsRUFDbkIsU0FBWSxFQUNaLFFBS1MsRUFDVCxLQUF3QixFQUN4Qix1QkFBZ0MsS0FBSzs7VUFFL0IsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxvQkFBb0I7O1FBQzlDLENBQUMsR0FBRyxDQUFDO0lBRVQsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFOztjQUN4QixJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDaEI7YUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDM0IsTUFBTTtTQUNQOztjQUVLLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QixJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRTtZQUNsQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUNwQixxQkFBVyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN0RDtLQUNGO0lBRUQsMkVBQTJFO0lBQzNFLHVDQUF1QztJQUN2QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFOztjQUNoQyxVQUFVLEdBQUcsQ0FBQztRQUVwQixLQUFLLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM1QyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN0QztRQUVELEtBQUssQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFOztrQkFDdEMsSUFBSSxHQUFHLHdCQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBVTs7a0JBQ3hCLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV6QixJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUU7Z0JBQ2pDLHFCQUFXLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3REO1lBRUQsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNmLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBRXBCLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO1FBRUQsb0JBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWpDLEtBQUssTUFBTSxJQUFJLElBQUksYUFBYSxFQUFFO1lBQ2hDLHFCQUFXLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3pELE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO0tBQ0Y7SUFFRCxlQUFLLEVBQUUsQ0FBQztBQUNWLENBQUM7QUFFUSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbIi8vICBDb3B5cmlnaHQgMjAxOCBUaGUgSW5jcmVtZW50YWwgRE9NIEF1dGhvcnMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vKiogQGxpY2Vuc2UgU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjAgKi9cblxuaW1wb3J0IHsgQXR0ck11dGF0b3JDb25maWcgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgY3JlYXRlTWFwLCB0cnVuY2F0ZUFycmF5IH0gZnJvbSBcIi4vdXRpbFwiO1xuaW1wb3J0IHsgZmx1c2gsIHF1ZXVlQ2hhbmdlIH0gZnJvbSBcIi4vY2hhbmdlc1wiO1xuXG4vKipcbiAqIFVzZWQgdG8ga2VlcCB0cmFjayBvZiB0aGUgcHJldmlvdXMgdmFsdWVzIHdoZW4gYSAyLXdheSBkaWZmIGlzIG5lY2Vzc2FyeS5cbiAqIFRoaXMgb2JqZWN0IGlzIGNsZWFyZWQgb3V0IGFuZCByZXVzZWQuXG4gKi9cbmNvbnN0IHByZXZWYWx1ZXNNYXAgPSBjcmVhdGVNYXAoKTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBkaWZmIGJldHdlZW4gcHJldmlvdXMgYW5kIG5leHQgdmFsdWVzLCBjYWxsaW5nIHRoZSB1cGRhdGVcbiAqIGZ1bmN0aW9uIHdoZW4gYW4gaXRlbSBoYXMgY2hhbmdlZCB2YWx1ZS4gSWYgYW4gaXRlbSBmcm9tIHRoZSBwcmV2aW91cyB2YWx1ZXNcbiAqIGlzIG5vdCBwcmVzZW50IGluIHRoZSB0aGUgbmV4dCB2YWx1ZXMsIHRoZSB1cGRhdGUgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggYVxuICogdmFsdWUgb2YgYHVuZGVmaW5lZGAuXG4gKiBAcGFyYW0gcHJldiBUaGUgcHJldmlvdXMgdmFsdWVzLCBhbHRlcm5hdGluZyBuYW1lLCB2YWx1ZSBwYWlycy5cbiAqIEBwYXJhbSBuZXh0IFRoZSBuZXh0IHZhbHVlcywgYWx0ZXJuYXRpbmcgbmFtZSwgdmFsdWUgcGFpcnMuXG4gKiBAcGFyYW0gdXBkYXRlQ3R4IFRoZSBjb250ZXh0IGZvciB0aGUgdXBkYXRlRm4uXG4gKiBAcGFyYW0gdXBkYXRlRm4gQSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gYSB2YWx1ZSBoYXMgY2hhbmdlZC5cbiAqIEBwYXJhbSBhdHRycyBBdHRyaWJ1dGUgbWFwIGZvciBtdXRhdG9yc1xuICogQHBhcmFtIGFsd2F5c0RpZmZBdHRyaWJ1dGVzIFdoZXRoZXIgdG8gZGlmZiBhdHRyaWJ1dGVzIHVuY29uZGl0aW9uYWxseVxuICovXG5mdW5jdGlvbiBjYWxjdWxhdGVEaWZmPFQ+KFxuICBwcmV2OiBBcnJheTxzdHJpbmc+LFxuICBuZXh0OiBBcnJheTxzdHJpbmc+LFxuICB1cGRhdGVDdHg6IFQsXG4gIHVwZGF0ZUZuOiAoXG4gICAgY3R4OiBULFxuICAgIHg6IHN0cmluZyxcbiAgICB5OiB7fSB8IHVuZGVmaW5lZCxcbiAgICBhdHRyczogQXR0ck11dGF0b3JDb25maWdcbiAgKSA9PiB2b2lkLFxuICBhdHRyczogQXR0ck11dGF0b3JDb25maWcsXG4gIGFsd2F5c0RpZmZBdHRyaWJ1dGVzOiBib29sZWFuID0gZmFsc2Vcbikge1xuICBjb25zdCBpc05ldyA9ICFwcmV2Lmxlbmd0aCB8fCBhbHdheXNEaWZmQXR0cmlidXRlcztcbiAgbGV0IGkgPSAwO1xuXG4gIGZvciAoOyBpIDwgbmV4dC5sZW5ndGg7IGkgKz0gMikge1xuICAgIGNvbnN0IG5hbWUgPSBuZXh0W2ldO1xuICAgIGlmIChpc05ldykge1xuICAgICAgcHJldltpXSA9IG5hbWU7XG4gICAgfSBlbHNlIGlmIChwcmV2W2ldICE9PSBuYW1lKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IG5leHRbaSArIDFdO1xuICAgIGlmIChpc05ldyB8fCBwcmV2W2kgKyAxXSAhPT0gdmFsdWUpIHtcbiAgICAgIHByZXZbaSArIDFdID0gdmFsdWU7XG4gICAgICBxdWV1ZUNoYW5nZSh1cGRhdGVGbiwgdXBkYXRlQ3R4LCBuYW1lLCB2YWx1ZSwgYXR0cnMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEl0ZW1zIGRpZCBub3QgbGluZSB1cCBleGFjdGx5IGFzIGJlZm9yZSwgbmVlZCB0byBtYWtlIHN1cmUgb2xkIGl0ZW1zIGFyZVxuICAvLyByZW1vdmVkLiBUaGlzIHNob3VsZCBiZSBhIHJhcmUgY2FzZS5cbiAgaWYgKGkgPCBuZXh0Lmxlbmd0aCB8fCBpIDwgcHJldi5sZW5ndGgpIHtcbiAgICBjb25zdCBzdGFydEluZGV4ID0gaTtcblxuICAgIGZvciAoaSA9IHN0YXJ0SW5kZXg7IGkgPCBwcmV2Lmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICBwcmV2VmFsdWVzTWFwW3ByZXZbaV1dID0gcHJldltpICsgMV07XG4gICAgfVxuXG4gICAgZm9yIChpID0gc3RhcnRJbmRleDsgaSA8IG5leHQubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBuZXh0W2ldIGFzIHN0cmluZztcbiAgICAgIGNvbnN0IHZhbHVlID0gbmV4dFtpICsgMV07XG5cbiAgICAgIGlmIChwcmV2VmFsdWVzTWFwW25hbWVdICE9PSB2YWx1ZSkge1xuICAgICAgICBxdWV1ZUNoYW5nZSh1cGRhdGVGbiwgdXBkYXRlQ3R4LCBuYW1lLCB2YWx1ZSwgYXR0cnMpO1xuICAgICAgfVxuXG4gICAgICBwcmV2W2ldID0gbmFtZTtcbiAgICAgIHByZXZbaSArIDFdID0gdmFsdWU7XG5cbiAgICAgIGRlbGV0ZSBwcmV2VmFsdWVzTWFwW25hbWVdO1xuICAgIH1cblxuICAgIHRydW5jYXRlQXJyYXkocHJldiwgbmV4dC5sZW5ndGgpO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHByZXZWYWx1ZXNNYXApIHtcbiAgICAgIHF1ZXVlQ2hhbmdlKHVwZGF0ZUZuLCB1cGRhdGVDdHgsIG5hbWUsIHVuZGVmaW5lZCwgYXR0cnMpO1xuICAgICAgZGVsZXRlIHByZXZWYWx1ZXNNYXBbbmFtZV07XG4gICAgfVxuICB9XG5cbiAgZmx1c2goKTtcbn1cblxuZXhwb3J0IHsgY2FsY3VsYXRlRGlmZiB9O1xuIl19