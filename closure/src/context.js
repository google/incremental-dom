/**
 * @fileoverview added by tsickle
 * Generated from: src/context.ts
 * @suppress {checkTypes,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
goog.module('incrementaldom.src.context');
var module = module || { id: 'src/context.js' };
goog.require('tslib');
const tsickle_notifications_1 = goog.requireType("incrementaldom.src.notifications");
//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */
var notifications_1 = goog.require('incrementaldom.src.notifications');
/**
 * A context object keeps track of the state of a patch.
 */
class Context {
    /**
     * @param {(!DocumentFragment|!Element)} node
     */
    constructor(node) {
        this.created = [];
        this.deleted = [];
        this.node = node;
    }
    /**
     * @param {!Node} node
     * @return {void}
     */
    markCreated(node) {
        this.created.push(node);
    }
    /**
     * @param {!Node} node
     * @return {void}
     */
    markDeleted(node) {
        this.deleted.push(node);
    }
    /**
     * Notifies about nodes that were created during the patch operation.
     * @return {void}
     */
    notifyChanges() {
        if (notifications_1.notifications.nodesCreated && this.created.length > 0) {
            notifications_1.notifications.nodesCreated(this.created);
        }
        if (notifications_1.notifications.nodesDeleted && this.deleted.length > 0) {
            notifications_1.notifications.nodesDeleted(this.deleted);
        }
    }
}
exports.Context = Context;
/* istanbul ignore if */
if (false) {
    /**
     * @type {!Array<!Node>}
     * @private
     */
    Context.prototype.created;
    /**
     * @type {!Array<!Node>}
     * @private
     */
    Context.prototype.deleted;
    /** @type {(!DocumentFragment|!Element)} */
    Context.prototype.node;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBR0Esd0VBQWdEOzs7O0FBS2hELE1BQU0sT0FBTzs7OztJQUtYLFlBQW1CLElBQWdDO1FBSjNDLFlBQU8sR0FBZ0IsRUFBRSxDQUFDO1FBQzFCLFlBQU8sR0FBZ0IsRUFBRSxDQUFDO1FBSWhDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7Ozs7O0lBRU0sV0FBVyxDQUFDLElBQVU7UUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQzs7Ozs7SUFFTSxXQUFXLENBQUMsSUFBVTtRQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDOzs7OztJQUtNLGFBQWE7UUFDbEIsSUFBSSw2QkFBYSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDekQsNkJBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFDO1FBRUQsSUFBSSw2QkFBYSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDekQsNkJBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFDO0lBQ0gsQ0FBQztDQUNGO0FBRVEsMEJBQU87Ozs7Ozs7SUE5QmQsMEJBQWtDOzs7OztJQUNsQywwQkFBa0M7O0lBQ2xDLHVCQUFpRCIsInNvdXJjZXNDb250ZW50IjpbIi8vICBDb3B5cmlnaHQgMjAxOCBUaGUgSW5jcmVtZW50YWwgRE9NIEF1dGhvcnMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vKiogQGxpY2Vuc2UgU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjAgKi9cblxuaW1wb3J0IHsgbm90aWZpY2F0aW9ucyB9IGZyb20gXCIuL25vdGlmaWNhdGlvbnNcIjtcblxuLyoqXG4gKiBBIGNvbnRleHQgb2JqZWN0IGtlZXBzIHRyYWNrIG9mIHRoZSBzdGF0ZSBvZiBhIHBhdGNoLlxuICovXG5jbGFzcyBDb250ZXh0IHtcbiAgcHJpdmF0ZSBjcmVhdGVkOiBBcnJheTxOb2RlPiA9IFtdO1xuICBwcml2YXRlIGRlbGV0ZWQ6IEFycmF5PE5vZGU+ID0gW107XG4gIHB1YmxpYyByZWFkb25seSBub2RlOiBFbGVtZW50IHwgRG9jdW1lbnRGcmFnbWVudDtcblxuICBwdWJsaWMgY29uc3RydWN0b3Iobm9kZTogRWxlbWVudCB8IERvY3VtZW50RnJhZ21lbnQpIHtcbiAgICB0aGlzLm5vZGUgPSBub2RlO1xuICB9XG5cbiAgcHVibGljIG1hcmtDcmVhdGVkKG5vZGU6IE5vZGUpIHtcbiAgICB0aGlzLmNyZWF0ZWQucHVzaChub2RlKTtcbiAgfVxuXG4gIHB1YmxpYyBtYXJrRGVsZXRlZChub2RlOiBOb2RlKSB7XG4gICAgdGhpcy5kZWxldGVkLnB1c2gobm9kZSk7XG4gIH1cblxuICAvKipcbiAgICogTm90aWZpZXMgYWJvdXQgbm9kZXMgdGhhdCB3ZXJlIGNyZWF0ZWQgZHVyaW5nIHRoZSBwYXRjaCBvcGVyYXRpb24uXG4gICAqL1xuICBwdWJsaWMgbm90aWZ5Q2hhbmdlcygpIHtcbiAgICBpZiAobm90aWZpY2F0aW9ucy5ub2Rlc0NyZWF0ZWQgJiYgdGhpcy5jcmVhdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgIG5vdGlmaWNhdGlvbnMubm9kZXNDcmVhdGVkKHRoaXMuY3JlYXRlZCk7XG4gICAgfVxuXG4gICAgaWYgKG5vdGlmaWNhdGlvbnMubm9kZXNEZWxldGVkICYmIHRoaXMuZGVsZXRlZC5sZW5ndGggPiAwKSB7XG4gICAgICBub3RpZmljYXRpb25zLm5vZGVzRGVsZXRlZCh0aGlzLmRlbGV0ZWQpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBDb250ZXh0IH07XG4iXX0=