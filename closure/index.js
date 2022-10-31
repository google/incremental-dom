/**
 * @fileoverview added by tsickle
 * Generated from: index.ts
 * @suppress {checkTypes,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
goog.module('incrementaldom');
var module = module || { id: 'index.js' };
goog.require('tslib');
const tsickle_attributes_1 = goog.requireType("incrementaldom.src.attributes");
const tsickle_core_2 = goog.requireType("incrementaldom.src.core");
const tsickle_global_3 = goog.requireType("incrementaldom.src.global");
const tsickle_node_data_4 = goog.requireType("incrementaldom.src.node_data");
const tsickle_notifications_5 = goog.requireType("incrementaldom.src.notifications");
const tsickle_symbols_6 = goog.requireType("incrementaldom.src.symbols");
const tsickle_virtual_elements_7 = goog.requireType("incrementaldom.src.virtual_elements");
const tsickle_types_8 = goog.requireType("incrementaldom.src.types");
//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */
var attributes_1 = goog.require('incrementaldom.src.attributes');
exports.applyAttr = attributes_1.applyAttr;
exports.applyProp = attributes_1.applyProp;
exports.attributes = attributes_1.attributes;
exports.createAttributeMap = attributes_1.createAttributeMap;
var core_1 = goog.require('incrementaldom.src.core');
exports.alignWithDOM = core_1.alignWithDOM;
exports.alwaysDiffAttributes = core_1.alwaysDiffAttributes;
exports.close = core_1.close;
exports.createPatchInner = core_1.createPatchInner;
exports.createPatchOuter = core_1.createPatchOuter;
exports.currentElement = core_1.currentElement;
exports.currentContext = core_1.currentContext;
exports.currentPointer = core_1.currentPointer;
exports.open = core_1.open;
exports.patch = core_1.patchInner;
exports.patchInner = core_1.patchInner;
exports.patchOuter = core_1.patchOuter;
exports.skip = core_1.skip;
exports.skipNode = core_1.skipNode;
exports.tryGetCurrentElement = core_1.tryGetCurrentElement;
var global_1 = goog.require('incrementaldom.src.global');
exports.setKeyAttributeName = global_1.setKeyAttributeName;
var node_data_1 = goog.require('incrementaldom.src.node_data');
exports.clearCache = node_data_1.clearCache;
exports.getKey = node_data_1.getKey;
exports.importNode = node_data_1.importNode;
exports.isDataInitialized = node_data_1.isDataInitialized;
var notifications_1 = goog.require('incrementaldom.src.notifications');
exports.notifications = notifications_1.notifications;
var symbols_1 = goog.require('incrementaldom.src.symbols');
exports.symbols = symbols_1.symbols;
var virtual_elements_1 = goog.require('incrementaldom.src.virtual_elements');
exports.applyAttrs = virtual_elements_1.applyAttrs;
exports.applyStatics = virtual_elements_1.applyStatics;
exports.attr = virtual_elements_1.attr;
exports.elementClose = virtual_elements_1.elementClose;
exports.elementOpen = virtual_elements_1.elementOpen;
exports.elementOpenEnd = virtual_elements_1.elementOpenEnd;
exports.elementOpenStart = virtual_elements_1.elementOpenStart;
exports.elementVoid = virtual_elements_1.elementVoid;
exports.key = virtual_elements_1.key;
exports.text = virtual_elements_1.text;
var types_1 = goog.require('incrementaldom.src.types');
/** @typedef {!tsickle_types_8.ElementConstructor} */
exports.ElementConstructor; // re-export typedef
/** @typedef {!tsickle_types_8.AttrMutator} */
exports.AttrMutator; // re-export typedef
/** @typedef {!tsickle_types_8.AttrMutatorConfig} */
exports.AttrMutatorConfig; // re-export typedef
/** @typedef {!tsickle_types_8.NameOrCtorDef} */
exports.NameOrCtorDef; // re-export typedef
/** @typedef {!tsickle_types_8.Key} */
exports.Key; // re-export typedef
/** @typedef {!tsickle_types_8.Statics} */
exports.Statics; // re-export typedef
/** @typedef {!tsickle_types_8.PatchFunction} */
exports.PatchFunction; // re-export typedef
/** @typedef {!tsickle_types_8.MatchFnDef} */
exports.MatchFnDef; // re-export typedef
/** @typedef {!tsickle_types_8.PatchConfig} */
exports.PatchConfig; // re-export typedef
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxrRUFBc0Y7QUFBOUUsaUNBQUEsU0FBUyxDQUFBO0FBQUUsaUNBQUEsU0FBUyxDQUFBO0FBQUUsa0NBQUEsVUFBVSxDQUFBO0FBQUUsMENBQUEsa0JBQWtCLENBQUE7QUFDNUQsc0RBQWtQO0FBQTFPLDhCQUFBLFlBQVksQ0FBQTtBQUFFLHNDQUFBLG9CQUFvQixDQUFBO0FBQUUsdUJBQUEsS0FBSyxDQUFBO0FBQUUsa0NBQUEsZ0JBQWdCLENBQUE7QUFBRSxrQ0FBQSxnQkFBZ0IsQ0FBQTtBQUFFLGdDQUFBLGNBQWMsQ0FBQTtBQUFFLGdDQUFBLGNBQWMsQ0FBQTtBQUFFLGdDQUFBLGNBQWMsQ0FBQTtBQUFFLHNCQUFBLElBQUksQ0FBQTtBQUFFLHVCQUFBLFVBQVUsQ0FBUztBQUFFLDRCQUFBLFVBQVUsQ0FBQTtBQUFFLDRCQUFBLFVBQVUsQ0FBQTtBQUFFLHNCQUFBLElBQUksQ0FBQTtBQUFFLDBCQUFBLFFBQVEsQ0FBQTtBQUFFLHNDQUFBLG9CQUFvQixDQUFBO0FBQzlOLDBEQUFpRDtBQUF6Qyx1Q0FBQSxtQkFBbUIsQ0FBQTtBQUMzQixnRUFBaUY7QUFBekUsaUNBQUEsVUFBVSxDQUFBO0FBQUMsNkJBQUEsTUFBTSxDQUFBO0FBQUUsaUNBQUEsVUFBVSxDQUFBO0FBQUUsd0NBQUEsaUJBQWlCLENBQUE7QUFDeEQsd0VBQWtEO0FBQTFDLHdDQUFBLGFBQWEsQ0FBQTtBQUNyQiw0REFBc0M7QUFBOUIsNEJBQUEsT0FBTyxDQUFBO0FBQ2YsOEVBQTJKO0FBQW5KLHdDQUFBLFVBQVUsQ0FBQTtBQUFFLDBDQUFBLFlBQVksQ0FBQTtBQUFFLGtDQUFBLElBQUksQ0FBQTtBQUFFLDBDQUFBLFlBQVksQ0FBQTtBQUFFLHlDQUFBLFdBQVcsQ0FBQTtBQUFFLDRDQUFBLGNBQWMsQ0FBQTtBQUFFLDhDQUFBLGdCQUFnQixDQUFBO0FBQUUseUNBQUEsV0FBVyxDQUFBO0FBQUUsaUNBQUEsR0FBRyxDQUFBO0FBQUUsa0NBQUEsSUFBSSxDQUFBO0FBQzNILHdEQUE0QiIsInNvdXJjZXNDb250ZW50IjpbIi8vICBDb3B5cmlnaHQgMjAxOCBUaGUgSW5jcmVtZW50YWwgRE9NIEF1dGhvcnMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vKiogQGxpY2Vuc2UgU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjAgKi9cblxuZXhwb3J0IHthcHBseUF0dHIsIGFwcGx5UHJvcCwgYXR0cmlidXRlcywgY3JlYXRlQXR0cmlidXRlTWFwfSBmcm9tICcuL3NyYy9hdHRyaWJ1dGVzJztcbmV4cG9ydCB7YWxpZ25XaXRoRE9NLCBhbHdheXNEaWZmQXR0cmlidXRlcywgY2xvc2UsIGNyZWF0ZVBhdGNoSW5uZXIsIGNyZWF0ZVBhdGNoT3V0ZXIsIGN1cnJlbnRFbGVtZW50LCBjdXJyZW50Q29udGV4dCwgY3VycmVudFBvaW50ZXIsIG9wZW4sIHBhdGNoSW5uZXIgYXMgcGF0Y2gsIHBhdGNoSW5uZXIsIHBhdGNoT3V0ZXIsIHNraXAsIHNraXBOb2RlLCB0cnlHZXRDdXJyZW50RWxlbWVudH0gZnJvbSAnLi9zcmMvY29yZSc7XG5leHBvcnQge3NldEtleUF0dHJpYnV0ZU5hbWV9IGZyb20gJy4vc3JjL2dsb2JhbCc7XG5leHBvcnQge2NsZWFyQ2FjaGUsZ2V0S2V5LCBpbXBvcnROb2RlLCBpc0RhdGFJbml0aWFsaXplZH0gZnJvbSAnLi9zcmMvbm9kZV9kYXRhJztcbmV4cG9ydCB7bm90aWZpY2F0aW9uc30gZnJvbSAnLi9zcmMvbm90aWZpY2F0aW9ucyc7XG5leHBvcnQge3N5bWJvbHN9IGZyb20gJy4vc3JjL3N5bWJvbHMnO1xuZXhwb3J0IHthcHBseUF0dHJzLCBhcHBseVN0YXRpY3MsIGF0dHIsIGVsZW1lbnRDbG9zZSwgZWxlbWVudE9wZW4sIGVsZW1lbnRPcGVuRW5kLCBlbGVtZW50T3BlblN0YXJ0LCBlbGVtZW50Vm9pZCwga2V5LCB0ZXh0fSBmcm9tICcuL3NyYy92aXJ0dWFsX2VsZW1lbnRzJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL3R5cGVzJztcbiJdfQ==