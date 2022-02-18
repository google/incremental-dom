/**
 * @fileoverview added by tsickle
 * Generated from: src/notifications.ts
 * @suppress {checkTypes,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */
goog.module('incrementaldom.src.notifications');
var module = module || { id: 'src/notifications.js' };
goog.require('tslib');
/** @typedef {function(!Array<!Node>): void} */
exports.NodeFunction;
/**
 * @record
 */
function Notifications() { }
exports.Notifications = Notifications;
/* istanbul ignore if */
if (false) {
    /**
     * Called after patch has completed with any Nodes that have been created
     * and added to the DOM.
     * @type {(null|function(!Array<!Node>): void)}
     */
    Notifications.prototype.nodesCreated;
    /**
     * Called after patch has completed with any Nodes that have been removed
     * from the DOM.
     * Note it's an application's responsibility to handle any childNodes.
     * @type {(null|function(!Array<!Node>): void)}
     */
    Notifications.prototype.nodesDeleted;
}
/** @type {!Notifications} */
exports.notifications = {
    nodesCreated: null,
    nodesDeleted: null
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ub3RpZmljYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBR0EscUJBQW9EOzs7O0FBRXBELDRCQVlDOzs7Ozs7Ozs7SUFQQyxxQ0FBa0M7Ozs7Ozs7SUFNbEMscUNBQWtDOzs7QUFHdkIsUUFBQSxhQUFhLEdBQWtCO0lBQzFDLFlBQVksRUFBRSxJQUFJO0lBQ2xCLFlBQVksRUFBRSxJQUFJO0NBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiLy8gIENvcHlyaWdodCAyMDE4IFRoZSBJbmNyZW1lbnRhbCBET00gQXV0aG9ycy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8qKiBAbGljZW5zZSBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMCAqL1xuXG5leHBvcnQgdHlwZSBOb2RlRnVuY3Rpb24gPSAobjogQXJyYXk8Tm9kZT4pID0+IHZvaWQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm90aWZpY2F0aW9ucyB7XG4gIC8qKlxuICAgKiBDYWxsZWQgYWZ0ZXIgcGF0Y2ggaGFzIGNvbXBsZXRlZCB3aXRoIGFueSBOb2RlcyB0aGF0IGhhdmUgYmVlbiBjcmVhdGVkXG4gICAqIGFuZCBhZGRlZCB0byB0aGUgRE9NLlxuICAgKi9cbiAgbm9kZXNDcmVhdGVkOiBOb2RlRnVuY3Rpb24gfCBudWxsO1xuICAvKipcbiAgICogQ2FsbGVkIGFmdGVyIHBhdGNoIGhhcyBjb21wbGV0ZWQgd2l0aCBhbnkgTm9kZXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZFxuICAgKiBmcm9tIHRoZSBET00uXG4gICAqIE5vdGUgaXQncyBhbiBhcHBsaWNhdGlvbidzIHJlc3BvbnNpYmlsaXR5IHRvIGhhbmRsZSBhbnkgY2hpbGROb2Rlcy5cbiAgICovXG4gIG5vZGVzRGVsZXRlZDogTm9kZUZ1bmN0aW9uIHwgbnVsbDtcbn1cblxuZXhwb3J0IGNvbnN0IG5vdGlmaWNhdGlvbnM6IE5vdGlmaWNhdGlvbnMgPSB7XG4gIG5vZGVzQ3JlYXRlZDogbnVsbCxcbiAgbm9kZXNEZWxldGVkOiBudWxsXG59O1xuIl19