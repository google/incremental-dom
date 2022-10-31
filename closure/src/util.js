/**
 * @fileoverview added by tsickle
 * Generated from: src/util.ts
 * @suppress {checkTypes,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */
goog.module('incrementaldom.src.util');
var module = module || { id: 'src/util.js' };
goog.require('tslib');
/**
 * A cached reference to the hasOwnProperty function.
 * @type {function((string|number|symbol)): boolean}
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * A constructor function that will create blank objects.
 * @return {void}
 */
function Blank() { }
Blank.prototype = Object.create(null);
/**
 * Used to prevent property collisions between our "map" and its prototype.
 * @param {!Object} map The map to check.
 * @param {string} property The property to check.
 * @return {boolean} Whether map has property.
 */
function has(map, property) {
    return hasOwnProperty.call(map, property);
}
exports.has = has;
/**
 * Creates an map object without a prototype.
 * @return {?} An Object that can be used as a map.
 */
function createMap() {
    return new ((/** @type {?} */ (Blank)))();
}
exports.createMap = createMap;
/**
 * Truncates an array, removing items up until length.
 * @param {!Array<(undefined|null|*)>} arr The array to truncate.
 * @param {number} length The new length of the array.
 * @return {void}
 */
function truncateArray(arr, length) {
    while (arr.length > length) {
        arr.pop();
    }
}
exports.truncateArray = truncateArray;
/**
 * Creates an array for a desired initial size. Note that the array will still
 * be empty.
 * @template T
 * @param {number} initialAllocationSize The initial size to allocate.
 * @return {!Array<T>} An empty array, with an initial allocation for the desired size.
 */
function createArray(initialAllocationSize) {
    /** @type {!Array<?>} */
    const arr = new Array(initialAllocationSize);
    truncateArray(arr, 0);
    return arr;
}
exports.createArray = createArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O01BTU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYzs7Ozs7QUFLdEQsU0FBUyxLQUFLLEtBQUksQ0FBQztBQUVuQixLQUFLLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7Ozs7QUFRdEMsU0FBUyxHQUFHLENBQUMsR0FBVyxFQUFFLFFBQWdCO0lBQ3hDLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQWlDZ0Msa0JBQUc7Ozs7O0FBM0JwQyxTQUFTLFNBQVM7SUFDaEIsT0FBTyxJQUFJLENBQUMsbUJBQUEsS0FBSyxFQUFPLENBQUMsRUFBRSxDQUFDO0FBQzlCLENBQUM7QUF5QnFCLDhCQUFTOzs7Ozs7O0FBbEIvQixTQUFTLGFBQWEsQ0FBQyxHQUFpQyxFQUFFLE1BQWM7SUFDdEUsT0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRTtRQUMxQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDWDtBQUNILENBQUM7QUFjcUMsc0NBQWE7Ozs7Ozs7O0FBTm5ELFNBQVMsV0FBVyxDQUFJLHFCQUE2Qjs7VUFDN0MsR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDO0lBQzVDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdEIsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRVEsa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvLyAgQ29weXJpZ2h0IDIwMTggVGhlIEluY3JlbWVudGFsIERPTSBBdXRob3JzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLyoqIEBsaWNlbnNlIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wICovXG5cbi8qKlxuICogQSBjYWNoZWQgcmVmZXJlbmNlIHRvIHRoZSBoYXNPd25Qcm9wZXJ0eSBmdW5jdGlvbi5cbiAqL1xuY29uc3QgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgY29uc3RydWN0b3IgZnVuY3Rpb24gdGhhdCB3aWxsIGNyZWF0ZSBibGFuayBvYmplY3RzLlxuICovXG5mdW5jdGlvbiBCbGFuaygpIHt9XG5cbkJsYW5rLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbi8qKlxuICogVXNlZCB0byBwcmV2ZW50IHByb3BlcnR5IGNvbGxpc2lvbnMgYmV0d2VlbiBvdXIgXCJtYXBcIiBhbmQgaXRzIHByb3RvdHlwZS5cbiAqIEBwYXJhbSBtYXAgVGhlIG1hcCB0byBjaGVjay5cbiAqIEBwYXJhbSBwcm9wZXJ0eSBUaGUgcHJvcGVydHkgdG8gY2hlY2suXG4gKiBAcmV0dXJuIFdoZXRoZXIgbWFwIGhhcyBwcm9wZXJ0eS5cbiAqL1xuZnVuY3Rpb24gaGFzKG1hcDogb2JqZWN0LCBwcm9wZXJ0eTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG1hcCwgcHJvcGVydHkpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gbWFwIG9iamVjdCB3aXRob3V0IGEgcHJvdG90eXBlLlxuICogQHJldHVybnMgQW4gT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgYXMgYSBtYXAuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZU1hcCgpOiBhbnkge1xuICByZXR1cm4gbmV3IChCbGFuayBhcyBhbnkpKCk7XG59XG5cbi8qKlxuICogVHJ1bmNhdGVzIGFuIGFycmF5LCByZW1vdmluZyBpdGVtcyB1cCB1bnRpbCBsZW5ndGguXG4gKiBAcGFyYW0gYXJyIFRoZSBhcnJheSB0byB0cnVuY2F0ZS5cbiAqIEBwYXJhbSBsZW5ndGggVGhlIG5ldyBsZW5ndGggb2YgdGhlIGFycmF5LlxuICovXG5mdW5jdGlvbiB0cnVuY2F0ZUFycmF5KGFycjogQXJyYXk8e30gfCBudWxsIHwgdW5kZWZpbmVkPiwgbGVuZ3RoOiBudW1iZXIpIHtcbiAgd2hpbGUgKGFyci5sZW5ndGggPiBsZW5ndGgpIHtcbiAgICBhcnIucG9wKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IGZvciBhIGRlc2lyZWQgaW5pdGlhbCBzaXplLiBOb3RlIHRoYXQgdGhlIGFycmF5IHdpbGwgc3RpbGxcbiAqIGJlIGVtcHR5LlxuICogQHBhcmFtIGluaXRpYWxBbGxvY2F0aW9uU2l6ZSBUaGUgaW5pdGlhbCBzaXplIHRvIGFsbG9jYXRlLlxuICogQHJldHVybnMgQW4gZW1wdHkgYXJyYXksIHdpdGggYW4gaW5pdGlhbCBhbGxvY2F0aW9uIGZvciB0aGUgZGVzaXJlZCBzaXplLlxuICovXG5mdW5jdGlvbiBjcmVhdGVBcnJheTxUPihpbml0aWFsQWxsb2NhdGlvblNpemU6IG51bWJlcik6IEFycmF5PFQ+IHtcbiAgY29uc3QgYXJyID0gbmV3IEFycmF5KGluaXRpYWxBbGxvY2F0aW9uU2l6ZSk7XG4gIHRydW5jYXRlQXJyYXkoYXJyLCAwKTtcbiAgcmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IHsgY3JlYXRlQXJyYXksIGNyZWF0ZU1hcCwgaGFzLCB0cnVuY2F0ZUFycmF5IH07XG4iXX0=