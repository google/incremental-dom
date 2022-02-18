/**
 * @fileoverview added by tsickle
 * Generated from: src/changes.ts
 * @suppress {checkTypes,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
goog.module('incrementaldom.src.changes');
var module = module || { id: 'src/changes.js' };
goog.require('tslib');
const tsickle_util_1 = goog.requireType("incrementaldom.src.util");
//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */
var util_1 = goog.require('incrementaldom.src.util');
/** @type {!Array<?>} */
const buffer = [];
/** @type {number} */
let bufferStart = 0;
/**
 * TODO(tomnguyen): This is a bit silly and really needs to be better typed.
 * @template A, B, C, D
 * @param {function(A, B, C, D): void} fn A function to call.
 * @param {A} a The first argument to the function.
 * @param {B} b The second argument to the function.
 * @param {C} c The third argument to the function.
 * @param {D} d The fourth argument to the function
 * @return {void}
 */
function queueChange(fn, a, b, c, d) {
    buffer.push(fn);
    buffer.push(a);
    buffer.push(b);
    buffer.push(c);
    buffer.push(d);
}
exports.queueChange = queueChange;
/**
 * Flushes the changes buffer, calling the functions for each change.
 * @return {void}
 */
function flush() {
    // A change may cause this function to be called re-entrantly. Keep track of
    // the portion of the buffer we are consuming. Updates the start pointer so
    // that the next call knows where to start from.
    /** @type {number} */
    const start = bufferStart;
    /** @type {number} */
    const end = buffer.length;
    bufferStart = end;
    for (let i = start; i < end; i += 5) {
        /** @type {function(?, ?, ?, ?): undefined} */
        const fn = (/** @type {function(?, ?, ?, ?): undefined} */ (buffer[i]));
        fn(buffer[i + 1], buffer[i + 2], buffer[i + 3], buffer[i + 4]);
    }
    bufferStart = start;
    util_1.truncateArray(buffer, start);
}
exports.flush = flush;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jaGFuZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBR0Esc0RBQXVDOztNQUVqQyxNQUFNLEdBQWUsRUFBRTs7SUFFekIsV0FBVyxHQUFHLENBQUM7Ozs7Ozs7Ozs7O0FBVW5CLFNBQVMsV0FBVyxDQUNsQixFQUFvQyxFQUNwQyxDQUFJLEVBQ0osQ0FBSSxFQUNKLENBQUksRUFDSixDQUFJO0lBRUosTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLENBQUM7QUF1QlEsa0NBQVc7Ozs7O0FBbEJwQixTQUFTLEtBQUs7Ozs7O1VBSU4sS0FBSyxHQUFHLFdBQVc7O1VBQ25CLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTTtJQUV6QixXQUFXLEdBQUcsR0FBRyxDQUFDO0lBRWxCLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTs7Y0FDN0IsRUFBRSxHQUFHLGlEQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBaUQ7UUFDckUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoRTtJQUVELFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDcEIsb0JBQWEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQUVxQixzQkFBSyIsInNvdXJjZXNDb250ZW50IjpbIi8vICBDb3B5cmlnaHQgMjAxOCBUaGUgSW5jcmVtZW50YWwgRE9NIEF1dGhvcnMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vKiogQGxpY2Vuc2UgU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjAgKi9cblxuaW1wb3J0IHsgdHJ1bmNhdGVBcnJheSB9IGZyb20gXCIuL3V0aWxcIjtcblxuY29uc3QgYnVmZmVyOiBBcnJheTxhbnk+ID0gW107XG5cbmxldCBidWZmZXJTdGFydCA9IDA7XG5cbi8qKlxuICogVE9ETyh0b21uZ3V5ZW4pOiBUaGlzIGlzIGEgYml0IHNpbGx5IGFuZCByZWFsbHkgbmVlZHMgdG8gYmUgYmV0dGVyIHR5cGVkLlxuICogQHBhcmFtIGZuIEEgZnVuY3Rpb24gdG8gY2FsbC5cbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgZnVuY3Rpb24uXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIGFyZ3VtZW50IHRvIHRoZSBmdW5jdGlvbi5cbiAqIEBwYXJhbSBjIFRoZSB0aGlyZCBhcmd1bWVudCB0byB0aGUgZnVuY3Rpb24uXG4gKiBAcGFyYW0gZCBUaGUgZm91cnRoIGFyZ3VtZW50IHRvIHRoZSBmdW5jdGlvblxuICovXG5mdW5jdGlvbiBxdWV1ZUNoYW5nZTxBLCBCLCBDLCBEPihcbiAgZm46IChhOiBBLCBiOiBCLCBjOiBDLCBkOiBEKSA9PiB2b2lkLFxuICBhOiBBLFxuICBiOiBCLFxuICBjOiBDLFxuICBkOiBEXG4pIHtcbiAgYnVmZmVyLnB1c2goZm4pO1xuICBidWZmZXIucHVzaChhKTtcbiAgYnVmZmVyLnB1c2goYik7XG4gIGJ1ZmZlci5wdXNoKGMpO1xuICBidWZmZXIucHVzaChkKTtcbn1cblxuLyoqXG4gKiBGbHVzaGVzIHRoZSBjaGFuZ2VzIGJ1ZmZlciwgY2FsbGluZyB0aGUgZnVuY3Rpb25zIGZvciBlYWNoIGNoYW5nZS5cbiAqL1xuZnVuY3Rpb24gZmx1c2goKSB7XG4gIC8vIEEgY2hhbmdlIG1heSBjYXVzZSB0aGlzIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCByZS1lbnRyYW50bHkuIEtlZXAgdHJhY2sgb2ZcbiAgLy8gdGhlIHBvcnRpb24gb2YgdGhlIGJ1ZmZlciB3ZSBhcmUgY29uc3VtaW5nLiBVcGRhdGVzIHRoZSBzdGFydCBwb2ludGVyIHNvXG4gIC8vIHRoYXQgdGhlIG5leHQgY2FsbCBrbm93cyB3aGVyZSB0byBzdGFydCBmcm9tLlxuICBjb25zdCBzdGFydCA9IGJ1ZmZlclN0YXJ0O1xuICBjb25zdCBlbmQgPSBidWZmZXIubGVuZ3RoO1xuXG4gIGJ1ZmZlclN0YXJ0ID0gZW5kO1xuXG4gIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSA1KSB7XG4gICAgY29uc3QgZm4gPSBidWZmZXJbaV0gYXMgKGE6IGFueSwgYjogYW55LCBjOiBhbnksIGQ6IGFueSkgPT4gdW5kZWZpbmVkO1xuICAgIGZuKGJ1ZmZlcltpICsgMV0sIGJ1ZmZlcltpICsgMl0sIGJ1ZmZlcltpICsgM10sIGJ1ZmZlcltpICsgNF0pO1xuICB9XG5cbiAgYnVmZmVyU3RhcnQgPSBzdGFydDtcbiAgdHJ1bmNhdGVBcnJheShidWZmZXIsIHN0YXJ0KTtcbn1cblxuZXhwb3J0IHsgcXVldWVDaGFuZ2UsIGZsdXNoIH07XG4iXX0=