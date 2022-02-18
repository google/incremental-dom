/**
 * @fileoverview added by tsickle
 * Generated from: src/core.ts
 * @suppress {checkTypes,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
goog.module('incrementaldom.src.core');
var module = module || { id: 'src/core.js' };
goog.require('tslib');
const tsickle_assertions_1 = goog.requireType("incrementaldom.src.assertions");
const tsickle_context_2 = goog.requireType("incrementaldom.src.context");
const tsickle_dom_util_3 = goog.requireType("incrementaldom.src.dom_util");
const tsickle_global_4 = goog.requireType("incrementaldom.src.global");
const tsickle_node_data_5 = goog.requireType("incrementaldom.src.node_data");
const tsickle_nodes_6 = goog.requireType("incrementaldom.src.nodes");
const tsickle_types_7 = goog.requireType("incrementaldom.src.types");
//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */
var assertions_1 = goog.require('incrementaldom.src.assertions');
var context_1 = goog.require('incrementaldom.src.context');
var dom_util_1 = goog.require('incrementaldom.src.dom_util');
var global_1 = goog.require('incrementaldom.src.global');
var node_data_1 = goog.require('incrementaldom.src.node_data');
var nodes_1 = goog.require('incrementaldom.src.nodes');
/**
 * The default match function to use, if one was not specified when creating
 * the patcher.
 * @param {!Node} matchNode The node to match against, unused.
 * @param {(string|!tsickle_types_7.ElementConstructor)} nameOrCtor The name or constructor as declared.
 * @param {(string|!tsickle_types_7.ElementConstructor)} expectedNameOrCtor The name or constructor of the existing node.
 * @param {(undefined|null|string|number)} key The key as declared.
 * @param {(undefined|null|string|number)} expectedKey The key of the existing node.
 * @return {boolean} True if the node matches, false otherwise.
 */
function defaultMatchFn(matchNode, nameOrCtor, expectedNameOrCtor, key, expectedKey) {
    // Key check is done using double equals as we want to treat a null key the
    // same as undefined. This should be okay as the only values allowed are
    // strings, null and undefined so the == semantics are not too weird.
    return nameOrCtor == expectedNameOrCtor && key == expectedKey;
}
/** @type {(null|!tsickle_context_2.Context)} */
let context = null;
/** @type {(null|!Node)} */
let currentNode = null;
/** @type {(null|!Node)} */
let currentParent = null;
/** @type {(null|!Document)} */
let doc = null;
/** @type {!Array<!Node>} */
let focusPath = [];
/** @type {function(!Node, (string|!tsickle_types_7.ElementConstructor), (string|!tsickle_types_7.ElementConstructor), (undefined|null|string|number), (undefined|null|string|number)): boolean} */
let matchFn = defaultMatchFn;
/**
 * Used to build up call arguments. Each patch call gets a separate copy, so
 * this works with nested calls to patch.
 * @type {!Array<(undefined|null|*)>}
 */
let argsBuilder = [];
/**
 * Used to build up attrs for the an element.
 * @type {!Array<?>}
 */
let attrsBuilder = [];
/**
 * TODO(sparhami) We should just export argsBuilder directly when Closure
 * Compiler supports ES6 directly.
 * @return {!Array<?>} The Array used for building arguments.
 */
function getArgsBuilder() {
    return argsBuilder;
}
exports.getArgsBuilder = getArgsBuilder;
/**
 * TODO(sparhami) We should just export attrsBuilder directly when Closure
 * Compiler supports ES6 directly.
 * @return {!Array<?>} The Array used for building arguments.
 */
function getAttrsBuilder() {
    return attrsBuilder;
}
exports.getAttrsBuilder = getAttrsBuilder;
/**
 * Checks whether or not the current node matches the specified nameOrCtor and
 * key. This uses the specified match function when creating the patcher.
 * @param {!Node} matchNode A node to match the data to.
 * @param {(string|!tsickle_types_7.ElementConstructor)} nameOrCtor The name or constructor to check for.
 * @param {(undefined|null|string|number)} key The key used to identify the Node.
 * @return {boolean} True if the node matches, false otherwise.
 */
function matches(matchNode, nameOrCtor, key) {
    /** @type {!tsickle_node_data_5.NodeData} */
    const data = node_data_1.getData(matchNode, key);
    return matchFn(matchNode, nameOrCtor, data.nameOrCtor, key, data.key);
}
/**
 * Finds the matching node, starting at `node` and looking at the subsequent
 * siblings if a key is used.
 * @param {(null|!Node)} matchNode The node to start looking at.
 * @param {(string|!tsickle_types_7.ElementConstructor)} nameOrCtor The name or constructor for the Node.
 * @param {(undefined|null|string|number)} key The key used to identify the Node.
 * @return {(null|!Node)} The matching Node, if any exists.
 */
function getMatchingNode(matchNode, nameOrCtor, key) {
    if (!matchNode) {
        return null;
    }
    /** @type {(null|!Node)} */
    let cur = matchNode;
    do {
        if (matches(cur, nameOrCtor, key)) {
            return cur;
        }
    } while (key && (cur = cur.nextSibling));
    return null;
}
/**
 * Updates the internal structure of a DOM node in the case that an external
 * framework tries to modify a DOM element.
 * @param {!Element} el The DOM node to update.
 * @return {void}
 */
function alwaysDiffAttributes(el) {
    node_data_1.getData(el).alwaysDiffAttributes = true;
}
exports.alwaysDiffAttributes = alwaysDiffAttributes;
/**
 * Clears out any unvisited Nodes in a given range.
 * @param {(null|!Node)} maybeParentNode
 * @param {(null|!Node)} startNode The node to start clearing from, inclusive.
 * @param {(null|!Node)} endNode The node to clear until, exclusive.
 * @return {void}
 */
function clearUnvisitedDOM(maybeParentNode, startNode, endNode) {
    /** @type {!Node} */
    const parentNode = (/** @type {!Node} */ (maybeParentNode));
    /** @type {(null|!Node)} */
    let child = startNode;
    while (child !== endNode) {
        /** @type {(null|!ChildNode)} */
        const next = (/** @type {!Node} */ (child)).nextSibling;
        parentNode.removeChild((/** @type {!Node} */ (child)));
        (/** @type {!tsickle_context_2.Context} */ (context)).markDeleted((/** @type {!Node} */ (child)));
        child = next;
    }
}
/**
 * @return {(null|!Node)} The next Node to be patched.
 */
function getNextNode() {
    if (currentNode) {
        return currentNode.nextSibling;
    }
    else {
        return (/** @type {!Node} */ (currentParent)).firstChild;
    }
}
/**
 * Changes to the first child of the current node.
 * @return {void}
 */
function enterNode() {
    currentParent = currentNode;
    currentNode = null;
}
/**
 * Changes to the parent of the current node, removing any unvisited children.
 * @return {void}
 */
function exitNode() {
    clearUnvisitedDOM(currentParent, getNextNode(), null);
    currentNode = currentParent;
    currentParent = (/** @type {!Node} */ (currentParent)).parentNode;
}
/**
 * Changes to the next sibling of the current node.
 * @return {void}
 */
function nextNode() {
    currentNode = getNextNode();
}
exports.skipNode = nextNode;
/**
 * Creates a Node and marking it as created.
 * @param {(string|!tsickle_types_7.ElementConstructor)} nameOrCtor The name or constructor for the Node.
 * @param {(undefined|null|string|number)} key The key used to identify the Node.
 * @param {(undefined|string)=} nonce The nonce attribute for the element.
 * @return {!Node} The newly created node.
 */
function createNode(nameOrCtor, key, nonce) {
    /** @type {?} */
    let node;
    if (nameOrCtor === "#text") {
        node = nodes_1.createText((/** @type {!Document} */ (doc)));
    }
    else {
        node = nodes_1.createElement((/** @type {!Document} */ (doc)), (/** @type {!Node} */ (currentParent)), nameOrCtor, key);
        if (nonce) {
            node.setAttribute("nonce", nonce);
        }
    }
    (/** @type {!tsickle_context_2.Context} */ (context)).markCreated(node);
    return node;
}
/**
 * Aligns the virtual Node definition with the actual DOM, moving the
 * corresponding DOM node to the correct location or creating it if necessary.
 * @param {(string|!tsickle_types_7.ElementConstructor)} nameOrCtor The name or constructor for the Node.
 * @param {(undefined|null|string|number)} key The key used to identify the Node.
 * @param {(undefined|string)=} nonce The nonce attribute for the element.
 * @return {void}
 */
function alignWithDOM(nameOrCtor, key, nonce) {
    nextNode();
    /** @type {(null|!Node)} */
    const existingNode = getMatchingNode(currentNode, nameOrCtor, key);
    /** @type {!Node} */
    const node = existingNode || createNode(nameOrCtor, key, nonce);
    // If we are at the matching node, then we are done.
    if (node === currentNode) {
        return;
    }
    // Re-order the node into the right position, preserving focus if either
    // node or currentNode are focused by making sure that they are not detached
    // from the DOM.
    if (focusPath.indexOf(node) >= 0) {
        // Move everything else before the node.
        dom_util_1.moveBefore((/** @type {!Node} */ (currentParent)), node, currentNode);
    }
    else {
        (/** @type {!Node} */ (currentParent)).insertBefore(node, currentNode);
    }
    currentNode = node;
}
exports.alignWithDOM = alignWithDOM;
/**
 * Makes sure that the current node is an Element with a matching nameOrCtor and
 * key.
 *
 * @param {(string|!tsickle_types_7.ElementConstructor)} nameOrCtor The tag or constructor for the Element.
 * @param {(undefined|null|string|number)=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {(undefined|string)=} nonce The nonce attribute for the element.
 * @return {!HTMLElement} The corresponding Element.
 */
function open(nameOrCtor, key, nonce) {
    alignWithDOM(nameOrCtor, key, nonce);
    enterNode();
    return (/** @type {!HTMLElement} */ (currentParent));
}
exports.open = open;
/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 * @return {!Element} The Element that was just closed.
 */
function close() {
    if (global_1.DEBUG) {
        assertions_1.setInSkip(false);
    }
    exitNode();
    return (/** @type {!Element} */ (currentNode));
}
exports.close = close;
/**
 * Makes sure the current node is a Text node and creates a Text node if it is
 * not.
 * @return {!Text} The Text node that was aligned or created.
 */
function text() {
    alignWithDOM("#text", null);
    return (/** @type {!Text} */ (currentNode));
}
exports.text = text;
/**
 * @return {!Element} The current Element being patched.
 */
function currentElement() {
    if (global_1.DEBUG) {
        assertions_1.assertInPatch("currentElement");
        assertions_1.assertNotInAttributes("currentElement");
    }
    return (/** @type {!Element} */ (currentParent));
}
exports.currentElement = currentElement;
/**
 * @return {(null|!Element)} The current Element being patched, or null if no patch is in progress.
 */
function tryGetCurrentElement() {
    return (/** @type {(null|!Element)} */ (currentParent));
}
exports.tryGetCurrentElement = tryGetCurrentElement;
/**
 * @return {!Node} The Node that will be evaluated for the next instruction.
 */
function currentPointer() {
    if (global_1.DEBUG) {
        assertions_1.assertInPatch("currentPointer");
        assertions_1.assertNotInAttributes("currentPointer");
    }
    // TODO(tomnguyen): assert that this is not null
    return (/** @type {!Node} */ (getNextNode()));
}
exports.currentPointer = currentPointer;
/**
 * @return {(null|!tsickle_context_2.Context)}
 */
function currentContext() {
    return context;
}
exports.currentContext = currentContext;
/**
 * Skips the children in a subtree, allowing an Element to be closed without
 * clearing out the children.
 * @return {void}
 */
function skip() {
    if (global_1.DEBUG) {
        assertions_1.assertNoChildrenDeclaredYet("skip", currentNode);
        assertions_1.setInSkip(true);
    }
    currentNode = (/** @type {!Node} */ (currentParent)).lastChild;
}
exports.skip = skip;
/**
 * Returns a patcher function that sets up and restores a patch context,
 * running the run function with the provided data.
 * @template T, R
 * @param {function((!DocumentFragment|!Element), function((undefined|T)): void, (undefined|T)=): R} run The function that will run the patch.
 * @param {!tsickle_types_7.PatchConfig=} patchConfig The configuration to use for the patch.
 * @return {function((!DocumentFragment|!Element), function((undefined|T)): void, (undefined|T)=): R} The created patch function.
 */
function createPatcher(run, patchConfig = {}) {
    const { matches = defaultMatchFn } = patchConfig;
    /** @type {function((!DocumentFragment|!Element), function((undefined|T)): void, (undefined|T)=): R} */
    const f = (/**
     * @param {(!DocumentFragment|!Element)} node
     * @param {function((undefined|T)): void} fn
     * @param {(undefined|T)} data
     * @return {R}
     */
    (node, fn, data) => {
        /** @type {(null|!tsickle_context_2.Context)} */
        const prevContext = context;
        /** @type {(null|!Document)} */
        const prevDoc = doc;
        /** @type {!Array<!Node>} */
        const prevFocusPath = focusPath;
        /** @type {!Array<(undefined|null|*)>} */
        const prevArgsBuilder = argsBuilder;
        /** @type {!Array<?>} */
        const prevAttrsBuilder = attrsBuilder;
        /** @type {(null|!Node)} */
        const prevCurrentNode = currentNode;
        /** @type {(null|!Node)} */
        const prevCurrentParent = currentParent;
        /** @type {function(!Node, (string|!tsickle_types_7.ElementConstructor), (string|!tsickle_types_7.ElementConstructor), (undefined|null|string|number), (undefined|null|string|number)): boolean} */
        const prevMatchFn = matchFn;
        /** @type {boolean} */
        let previousInAttributes = false;
        /** @type {boolean} */
        let previousInSkip = false;
        doc = node.ownerDocument;
        context = new context_1.Context(node);
        matchFn = matches;
        argsBuilder = [];
        attrsBuilder = [];
        currentNode = null;
        currentParent = node.parentNode;
        focusPath = dom_util_1.getFocusedPath(node, currentParent);
        if (global_1.DEBUG) {
            previousInAttributes = assertions_1.setInAttributes(false);
            previousInSkip = assertions_1.setInSkip(false);
            assertions_1.updatePatchContext(context);
        }
        try {
            /** @type {R} */
            const retVal = run(node, fn, data);
            if (global_1.DEBUG) {
                assertions_1.assertVirtualAttributesClosed();
            }
            return retVal;
        }
        finally {
            context.notifyChanges();
            doc = prevDoc;
            context = prevContext;
            matchFn = prevMatchFn;
            argsBuilder = prevArgsBuilder;
            attrsBuilder = prevAttrsBuilder;
            currentNode = prevCurrentNode;
            currentParent = prevCurrentParent;
            focusPath = prevFocusPath;
            // Needs to be done after assertions because assertions rely on state
            // from these methods.
            if (global_1.DEBUG) {
                assertions_1.setInAttributes(previousInAttributes);
                assertions_1.setInSkip(previousInSkip);
                assertions_1.updatePatchContext(context);
            }
        }
    });
    return f;
}
/**
 * Creates a patcher that patches the document starting at node with a
 * provided function. This function may be called during an existing patch operation.
 * @template T
 * @param {(undefined|!tsickle_types_7.PatchConfig)=} patchConfig The config to use for the patch.
 * @return {function((!DocumentFragment|!Element), function((undefined|T)): void, (undefined|T)=): !Node} The created function for patching an Element's children.
 */
function createPatchInner(patchConfig) {
    return createPatcher((/**
     * @param {(!DocumentFragment|!Element)} node
     * @param {function((undefined|T)): void} fn
     * @param {(undefined|T)} data
     * @return {(!DocumentFragment|!Element)}
     */
    (node, fn, data) => {
        currentNode = node;
        enterNode();
        fn(data);
        exitNode();
        if (global_1.DEBUG) {
            assertions_1.assertNoUnclosedTags(currentNode, node);
        }
        return node;
    }), patchConfig);
}
exports.createPatchInner = createPatchInner;
/**
 * Creates a patcher that patches an Element with the the provided function.
 * Exactly one top level element call should be made corresponding to `node`.
 * @template T
 * @param {(undefined|!tsickle_types_7.PatchConfig)=} patchConfig The config to use for the patch.
 * @return {function((!DocumentFragment|!Element), function((undefined|T)): void, (undefined|T)=): (null|!Node)} The created function for patching an Element.
 */
function createPatchOuter(patchConfig) {
    return createPatcher((/**
     * @param {(!DocumentFragment|!Element)} node
     * @param {function((undefined|T)): void} fn
     * @param {(undefined|T)} data
     * @return {(null|!Node)}
     */
    (node, fn, data) => {
        /** @type {!Element} */
        const startNode = (/** @type {!Element} */ (((/** @type {?} */ ({ nextSibling: node })))));
        /** @type {(null|!Node)} */
        let expectedNextNode = null;
        /** @type {(null|!Node)} */
        let expectedPrevNode = null;
        if (global_1.DEBUG) {
            expectedNextNode = node.nextSibling;
            expectedPrevNode = node.previousSibling;
        }
        currentNode = startNode;
        fn(data);
        if (global_1.DEBUG) {
            if (node_data_1.getData(node).key) {
                assertions_1.assertPatchOuterHasParentNode(currentParent);
            }
            assertions_1.assertPatchElementNoExtras(startNode, currentNode, expectedNextNode, expectedPrevNode);
        }
        if (currentParent) {
            clearUnvisitedDOM(currentParent, getNextNode(), node.nextSibling);
        }
        return startNode === currentNode ? null : currentNode;
    }), patchConfig);
}
exports.createPatchOuter = createPatchOuter;
/** @type {function((!DocumentFragment|!Element), function((undefined|?)): void, (undefined|?)=): !Node} */
const patchInner = createPatchInner();
exports.patchInner = patchInner;
/** @type {function((!DocumentFragment|!Element), function((undefined|?)): void, (undefined|?)=): (null|!Node)} */
const patchOuter = createPatchOuter();
exports.patchOuter = patchOuter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0Esa0VBV3NCO0FBQ3RCLDREQUFvQztBQUNwQyw4REFBd0Q7QUFDeEQsMERBQWlDO0FBQ2pDLGdFQUFzQztBQUN0Qyx3REFBb0Q7Ozs7Ozs7Ozs7O0FBbUJwRCxTQUFTLGNBQWMsQ0FDckIsU0FBZSxFQUNmLFVBQXlCLEVBQ3pCLGtCQUFpQyxFQUNqQyxHQUFRLEVBQ1IsV0FBZ0I7SUFFaEIsMkVBQTJFO0lBQzNFLHdFQUF3RTtJQUN4RSxxRUFBcUU7SUFDckUsT0FBTyxVQUFVLElBQUksa0JBQWtCLElBQUksR0FBRyxJQUFJLFdBQVcsQ0FBQztBQUNoRSxDQUFDOztJQUVHLE9BQU8sR0FBbUIsSUFBSTs7SUFFOUIsV0FBVyxHQUFnQixJQUFJOztJQUUvQixhQUFhLEdBQWdCLElBQUk7O0lBRWpDLEdBQUcsR0FBb0IsSUFBSTs7SUFFM0IsU0FBUyxHQUFnQixFQUFFOztJQUUzQixPQUFPLEdBQWUsY0FBYzs7Ozs7O0lBTXBDLFdBQVcsR0FBaUMsRUFBRTs7Ozs7SUFLOUMsWUFBWSxHQUFlLEVBQUU7Ozs7OztBQU9qQyxTQUFTLGNBQWM7SUFDckIsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQztBQW9hQyx3Q0FBYzs7Ozs7O0FBN1poQixTQUFTLGVBQWU7SUFDdEIsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQztBQTRaQywwQ0FBZTs7Ozs7Ozs7O0FBbFpqQixTQUFTLE9BQU8sQ0FDZCxTQUFlLEVBQ2YsVUFBeUIsRUFDekIsR0FBUTs7VUFFRixJQUFJLEdBQUcsbUJBQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDO0lBRXBDLE9BQU8sT0FBTyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FB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U0FDekM7UUFFRCxXQUFXLEdBQUcsU0FBUyxDQUFDO1FBQ3hCLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVULElBQUksY0FBSyxFQUFFO1lBQ1QsSUFBSSxtQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRTtnQkFDckIsMENBQTZCLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDOUM7WUFDRCx1Q0FBMEIsQ0FDeEIsU0FBUyxFQUNULFdBQVcsRUFDWCxnQkFBZ0IsRUFDaEIsZ0JBQWdCLENBQ2pCLENBQUM7U0FDSDtRQUVELElBQUksYUFBYSxFQUFFO1lBQ2pCLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDbkU7UUFFRCxPQUFPLFNBQVMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO0lBQ3hELENBQUMsR0FBRSxXQUFXLENBQUMsQ0FBQztBQUNsQixDQUFDO0FBb0JDLDRDQUFnQjs7TUFsQlosVUFBVSxHQUlKLGdCQUFnQixFQUFFO0FBZTVCLGdDQUFVOztNQWROLFVBQVUsR0FJRyxnQkFBZ0IsRUFBRTtBQVduQyxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbIi8vICBDb3B5cmlnaHQgMjAxOCBUaGUgSW5jcmVtZW50YWwgRE9NIEF1dGhvcnMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vKiogQGxpY2Vuc2UgU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjAgKi9cblxuaW1wb3J0IHtcbiAgYXNzZXJ0SW5QYXRjaCxcbiAgYXNzZXJ0Tm9DaGlsZHJlbkRlY2xhcmVkWWV0LFxuICBhc3NlcnROb3RJbkF0dHJpYnV0ZXMsXG4gIGFzc2VydE5vVW5jbG9zZWRUYWdzLFxuICBhc3NlcnRQYXRjaEVsZW1lbnROb0V4dHJhcyxcbiAgYXNzZXJ0UGF0Y2hPdXRlckhhc1BhcmVudE5vZGUsXG4gIGFzc2VydFZpcnR1YWxBdHRyaWJ1dGVzQ2xvc2VkLFxuICBzZXRJbkF0dHJpYnV0ZXMsXG4gIHNldEluU2tpcCxcbiAgdXBkYXRlUGF0Y2hDb250ZXh0XG59IGZyb20gXCIuL2Fzc2VydGlvbnNcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi9jb250ZXh0XCI7XG5pbXBvcnQgeyBnZXRGb2N1c2VkUGF0aCwgbW92ZUJlZm9yZSB9IGZyb20gXCIuL2RvbV91dGlsXCI7XG5pbXBvcnQgeyBERUJVRyB9IGZyb20gXCIuL2dsb2JhbFwiO1xuaW1wb3J0IHsgZ2V0RGF0YSB9IGZyb20gXCIuL25vZGVfZGF0YVwiO1xuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgY3JlYXRlVGV4dCB9IGZyb20gXCIuL25vZGVzXCI7XG5pbXBvcnQge1xuICBLZXksXG4gIE1hdGNoRm5EZWYsXG4gIE5hbWVPckN0b3JEZWYsXG4gIFBhdGNoQ29uZmlnLFxuICBQYXRjaEZ1bmN0aW9uXG59IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgbWF0Y2ggZnVuY3Rpb24gdG8gdXNlLCBpZiBvbmUgd2FzIG5vdCBzcGVjaWZpZWQgd2hlbiBjcmVhdGluZ1xuICogdGhlIHBhdGNoZXIuXG4gKiBAcGFyYW0gbWF0Y2hOb2RlIFRoZSBub2RlIHRvIG1hdGNoIGFnYWluc3QsIHVudXNlZC5cbiAqIEBwYXJhbSBuYW1lT3JDdG9yIFRoZSBuYW1lIG9yIGNvbnN0cnVjdG9yIGFzIGRlY2xhcmVkLlxuICogQHBhcmFtIGV4cGVjdGVkTmFtZU9yQ3RvciBUaGUgbmFtZSBvciBjb25zdHJ1Y3RvciBvZiB0aGUgZXhpc3Rpbmcgbm9kZS5cbiAqIEBwYXJhbSBrZXkgVGhlIGtleSBhcyBkZWNsYXJlZC5cbiAqIEBwYXJhbSBleHBlY3RlZEtleSBUaGUga2V5IG9mIHRoZSBleGlzdGluZyBub2RlLlxuICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgbm9kZSBtYXRjaGVzLCBmYWxzZSBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIGRlZmF1bHRNYXRjaEZuKFxuICBtYXRjaE5vZGU6IE5vZGUsXG4gIG5hbWVPckN0b3I6IE5hbWVPckN0b3JEZWYsXG4gIGV4cGVjdGVkTmFtZU9yQ3RvcjogTmFtZU9yQ3RvckRlZixcbiAga2V5OiBLZXksXG4gIGV4cGVjdGVkS2V5OiBLZXlcbik6IGJvb2xlYW4ge1xuICAvLyBLZXkgY2hlY2sgaXMgZG9uZSB1c2luZyBkb3VibGUgZXF1YWxzIGFzIHdlIHdhbnQgdG8gdHJlYXQgYSBudWxsIGtleSB0aGVcbiAgLy8gc2FtZSBhcyB1bmRlZmluZWQuIFRoaXMgc2hvdWxkIGJlIG9rYXkgYXMgdGhlIG9ubHkgdmFsdWVzIGFsbG93ZWQgYXJlXG4gIC8vIHN0cmluZ3MsIG51bGwgYW5kIHVuZGVmaW5lZCBzbyB0aGUgPT0gc2VtYW50aWNzIGFyZSBub3QgdG9vIHdlaXJkLlxuICByZXR1cm4gbmFtZU9yQ3RvciA9PSBleHBlY3RlZE5hbWVPckN0b3IgJiYga2V5ID09IGV4cGVjdGVkS2V5O1xufVxuXG5sZXQgY29udGV4dDogQ29udGV4dCB8IG51bGwgPSBudWxsO1xuXG5sZXQgY3VycmVudE5vZGU6IE5vZGUgfCBudWxsID0gbnVsbDtcblxubGV0IGN1cnJlbnRQYXJlbnQ6IE5vZGUgfCBudWxsID0gbnVsbDtcblxubGV0IGRvYzogRG9jdW1lbnQgfCBudWxsID0gbnVsbDtcblxubGV0IGZvY3VzUGF0aDogQXJyYXk8Tm9kZT4gPSBbXTtcblxubGV0IG1hdGNoRm46IE1hdGNoRm5EZWYgPSBkZWZhdWx0TWF0Y2hGbjtcblxuLyoqXG4gKiBVc2VkIHRvIGJ1aWxkIHVwIGNhbGwgYXJndW1lbnRzLiBFYWNoIHBhdGNoIGNhbGwgZ2V0cyBhIHNlcGFyYXRlIGNvcHksIHNvXG4gKiB0aGlzIHdvcmtzIHdpdGggbmVzdGVkIGNhbGxzIHRvIHBhdGNoLlxuICovXG5sZXQgYXJnc0J1aWxkZXI6IEFycmF5PHt9IHwgbnVsbCB8IHVuZGVmaW5lZD4gPSBbXTtcblxuLyoqXG4gKiBVc2VkIHRvIGJ1aWxkIHVwIGF0dHJzIGZvciB0aGUgYW4gZWxlbWVudC5cbiAqL1xubGV0IGF0dHJzQnVpbGRlcjogQXJyYXk8YW55PiA9IFtdO1xuXG4vKipcbiAqIFRPRE8oc3BhcmhhbWkpIFdlIHNob3VsZCBqdXN0IGV4cG9ydCBhcmdzQnVpbGRlciBkaXJlY3RseSB3aGVuIENsb3N1cmVcbiAqIENvbXBpbGVyIHN1cHBvcnRzIEVTNiBkaXJlY3RseS5cbiAqIEByZXR1cm5zIFRoZSBBcnJheSB1c2VkIGZvciBidWlsZGluZyBhcmd1bWVudHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFyZ3NCdWlsZGVyKCk6IEFycmF5PGFueT4ge1xuICByZXR1cm4gYXJnc0J1aWxkZXI7XG59XG5cbi8qKlxuICogVE9ETyhzcGFyaGFtaSkgV2Ugc2hvdWxkIGp1c3QgZXhwb3J0IGF0dHJzQnVpbGRlciBkaXJlY3RseSB3aGVuIENsb3N1cmVcbiAqIENvbXBpbGVyIHN1cHBvcnRzIEVTNiBkaXJlY3RseS5cbiAqIEByZXR1cm5zIFRoZSBBcnJheSB1c2VkIGZvciBidWlsZGluZyBhcmd1bWVudHMuXG4gKi9cbmZ1bmN0aW9uIGdldEF0dHJzQnVpbGRlcigpOiBBcnJheTxhbnk+IHtcbiAgcmV0dXJuIGF0dHJzQnVpbGRlcjtcbn1cblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBvciBub3QgdGhlIGN1cnJlbnQgbm9kZSBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgbmFtZU9yQ3RvciBhbmRcbiAqIGtleS4gVGhpcyB1c2VzIHRoZSBzcGVjaWZpZWQgbWF0Y2ggZnVuY3Rpb24gd2hlbiBjcmVhdGluZyB0aGUgcGF0Y2hlci5cbiAqIEBwYXJhbSBtYXRjaE5vZGUgQSBub2RlIHRvIG1hdGNoIHRoZSBkYXRhIHRvLlxuICogQHBhcmFtIG5hbWVPckN0b3IgVGhlIG5hbWUgb3IgY29uc3RydWN0b3IgdG8gY2hlY2sgZm9yLlxuICogQHBhcmFtIGtleSBUaGUga2V5IHVzZWQgdG8gaWRlbnRpZnkgdGhlIE5vZGUuXG4gKiBAcmV0dXJuIFRydWUgaWYgdGhlIG5vZGUgbWF0Y2hlcywgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5mdW5jdGlvbiBtYXRjaGVzKFxuICBtYXRjaE5vZGU6IE5vZGUsXG4gIG5hbWVPckN0b3I6IE5hbWVPckN0b3JEZWYsXG4gIGtleTogS2V5XG4pOiBib29sZWFuIHtcbiAgY29uc3QgZGF0YSA9IGdldERhdGEobWF0Y2hOb2RlLCBrZXkpO1xuXG4gIHJldHVybiBtYXRjaEZuKG1hdGNoTm9kZSwgbmFtZU9yQ3RvciwgZGF0YS5uYW1lT3JDdG9yLCBrZXksIGRhdGEua2V5KTtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgbWF0Y2hpbmcgbm9kZSwgc3RhcnRpbmcgYXQgYG5vZGVgIGFuZCBsb29raW5nIGF0IHRoZSBzdWJzZXF1ZW50XG4gKiBzaWJsaW5ncyBpZiBhIGtleSBpcyB1c2VkLlxuICogQHBhcmFtIG1hdGNoTm9kZSBUaGUgbm9kZSB0byBzdGFydCBsb29raW5nIGF0LlxuICogQHBhcmFtIG5hbWVPckN0b3IgVGhlIG5hbWUgb3IgY29uc3RydWN0b3IgZm9yIHRoZSBOb2RlLlxuICogQHBhcmFtIGtleSBUaGUga2V5IHVzZWQgdG8gaWRlbnRpZnkgdGhlIE5vZGUuXG4gKiBAcmV0dXJucyBUaGUgbWF0Y2hpbmcgTm9kZSwgaWYgYW55IGV4aXN0cy5cbiAqL1xuZnVuY3Rpb24gZ2V0TWF0Y2hpbmdOb2RlKFxuICBtYXRjaE5vZGU6IE5vZGUgfCBudWxsLFxuICBuYW1lT3JDdG9yOiBOYW1lT3JDdG9yRGVmLFxuICBrZXk6IEtleVxuKTogTm9kZSB8IG51bGwge1xuICBpZiAoIW1hdGNoTm9kZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGN1cjogTm9kZSB8IG51bGwgPSBtYXRjaE5vZGU7XG5cbiAgZG8ge1xuICAgIGlmIChtYXRjaGVzKGN1ciwgbmFtZU9yQ3Rvciwga2V5KSkge1xuICAgICAgcmV0dXJuIGN1cjtcbiAgICB9XG4gIH0gd2hpbGUgKGtleSAmJiAoY3VyID0gY3VyLm5leHRTaWJsaW5nKSk7XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgaW50ZXJuYWwgc3RydWN0dXJlIG9mIGEgRE9NIG5vZGUgaW4gdGhlIGNhc2UgdGhhdCBhbiBleHRlcm5hbFxuICogZnJhbWV3b3JrIHRyaWVzIHRvIG1vZGlmeSBhIERPTSBlbGVtZW50LlxuICogQHBhcmFtIGVsIFRoZSBET00gbm9kZSB0byB1cGRhdGUuXG4gKi9cbmZ1bmN0aW9uIGFsd2F5c0RpZmZBdHRyaWJ1dGVzKGVsOiBFbGVtZW50KSB7XG4gIGdldERhdGEoZWwpLmFsd2F5c0RpZmZBdHRyaWJ1dGVzID0gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDbGVhcnMgb3V0IGFueSB1bnZpc2l0ZWQgTm9kZXMgaW4gYSBnaXZlbiByYW5nZS5cbiAqIEBwYXJhbSBtYXliZVBhcmVudE5vZGVcbiAqIEBwYXJhbSBzdGFydE5vZGUgVGhlIG5vZGUgdG8gc3RhcnQgY2xlYXJpbmcgZnJvbSwgaW5jbHVzaXZlLlxuICogQHBhcmFtIGVuZE5vZGUgVGhlIG5vZGUgdG8gY2xlYXIgdW50aWwsIGV4Y2x1c2l2ZS5cbiAqL1xuZnVuY3Rpb24gY2xlYXJVbnZpc2l0ZWRET00oXG4gIG1heWJlUGFyZW50Tm9kZTogTm9kZSB8IG51bGwsXG4gIHN0YXJ0Tm9kZTogTm9kZSB8IG51bGwsXG4gIGVuZE5vZGU6IE5vZGUgfCBudWxsXG4pIHtcbiAgY29uc3QgcGFyZW50Tm9kZSA9IG1heWJlUGFyZW50Tm9kZSE7XG4gIGxldCBjaGlsZCA9IHN0YXJ0Tm9kZTtcblxuICB3aGlsZSAoY2hpbGQgIT09IGVuZE5vZGUpIHtcbiAgICBjb25zdCBuZXh0ID0gY2hpbGQhLm5leHRTaWJsaW5nO1xuICAgIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY2hpbGQhKTtcbiAgICBjb250ZXh0IS5tYXJrRGVsZXRlZChjaGlsZCEpO1xuICAgIGNoaWxkID0gbmV4dDtcbiAgfVxufVxuXG4vKipcbiAqIEByZXR1cm4gVGhlIG5leHQgTm9kZSB0byBiZSBwYXRjaGVkLlxuICovXG5mdW5jdGlvbiBnZXROZXh0Tm9kZSgpOiBOb2RlIHwgbnVsbCB7XG4gIGlmIChjdXJyZW50Tm9kZSkge1xuICAgIHJldHVybiBjdXJyZW50Tm9kZS5uZXh0U2libGluZztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY3VycmVudFBhcmVudCEuZmlyc3RDaGlsZDtcbiAgfVxufVxuXG4vKipcbiAqIENoYW5nZXMgdG8gdGhlIGZpcnN0IGNoaWxkIG9mIHRoZSBjdXJyZW50IG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGVudGVyTm9kZSgpIHtcbiAgY3VycmVudFBhcmVudCA9IGN1cnJlbnROb2RlO1xuICBjdXJyZW50Tm9kZSA9IG51bGw7XG59XG5cbi8qKlxuICogQ2hhbmdlcyB0byB0aGUgcGFyZW50IG9mIHRoZSBjdXJyZW50IG5vZGUsIHJlbW92aW5nIGFueSB1bnZpc2l0ZWQgY2hpbGRyZW4uXG4gKi9cbmZ1bmN0aW9uIGV4aXROb2RlKCkge1xuICBjbGVhclVudmlzaXRlZERPTShjdXJyZW50UGFyZW50LCBnZXROZXh0Tm9kZSgpLCBudWxsKTtcblxuICBjdXJyZW50Tm9kZSA9IGN1cnJlbnRQYXJlbnQ7XG4gIGN1cnJlbnRQYXJlbnQgPSBjdXJyZW50UGFyZW50IS5wYXJlbnROb2RlO1xufVxuXG4vKipcbiAqIENoYW5nZXMgdG8gdGhlIG5leHQgc2libGluZyBvZiB0aGUgY3VycmVudCBub2RlLlxuICovXG5mdW5jdGlvbiBuZXh0Tm9kZSgpIHtcbiAgY3VycmVudE5vZGUgPSBnZXROZXh0Tm9kZSgpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBOb2RlIGFuZCBtYXJraW5nIGl0IGFzIGNyZWF0ZWQuXG4gKiBAcGFyYW0gbmFtZU9yQ3RvciBUaGUgbmFtZSBvciBjb25zdHJ1Y3RvciBmb3IgdGhlIE5vZGUuXG4gKiBAcGFyYW0ga2V5IFRoZSBrZXkgdXNlZCB0byBpZGVudGlmeSB0aGUgTm9kZS5cbiAqIEBwYXJhbSBub25jZSBUaGUgbm9uY2UgYXR0cmlidXRlIGZvciB0aGUgZWxlbWVudC5cbiAqIEByZXR1cm4gVGhlIG5ld2x5IGNyZWF0ZWQgbm9kZS5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlTm9kZShuYW1lT3JDdG9yOiBOYW1lT3JDdG9yRGVmLCBrZXk6IEtleSwgbm9uY2U/OiBzdHJpbmcpOiBOb2RlIHtcbiAgbGV0IG5vZGU7XG5cbiAgaWYgKG5hbWVPckN0b3IgPT09IFwiI3RleHRcIikge1xuICAgIG5vZGUgPSBjcmVhdGVUZXh0KGRvYyEpO1xuICB9IGVsc2Uge1xuICAgIG5vZGUgPSBjcmVhdGVFbGVtZW50KGRvYyEsIGN1cnJlbnRQYXJlbnQhLCBuYW1lT3JDdG9yLCBrZXkpO1xuICAgIGlmIChub25jZSkge1xuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gICAgfVxuICB9XG5cbiAgY29udGV4dCEubWFya0NyZWF0ZWQobm9kZSk7XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbi8qKlxuICogQWxpZ25zIHRoZSB2aXJ0dWFsIE5vZGUgZGVmaW5pdGlvbiB3aXRoIHRoZSBhY3R1YWwgRE9NLCBtb3ZpbmcgdGhlXG4gKiBjb3JyZXNwb25kaW5nIERPTSBub2RlIHRvIHRoZSBjb3JyZWN0IGxvY2F0aW9uIG9yIGNyZWF0aW5nIGl0IGlmIG5lY2Vzc2FyeS5cbiAqIEBwYXJhbSBuYW1lT3JDdG9yIFRoZSBuYW1lIG9yIGNvbnN0cnVjdG9yIGZvciB0aGUgTm9kZS5cbiAqIEBwYXJhbSBrZXkgVGhlIGtleSB1c2VkIHRvIGlkZW50aWZ5IHRoZSBOb2RlLlxuICogQHBhcmFtIG5vbmNlIFRoZSBub25jZSBhdHRyaWJ1dGUgZm9yIHRoZSBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBhbGlnbldpdGhET00obmFtZU9yQ3RvcjogTmFtZU9yQ3RvckRlZiwga2V5OiBLZXksIG5vbmNlPzogc3RyaW5nKSB7XG4gIG5leHROb2RlKCk7XG4gIGNvbnN0IGV4aXN0aW5nTm9kZSA9IGdldE1hdGNoaW5nTm9kZShjdXJyZW50Tm9kZSwgbmFtZU9yQ3Rvciwga2V5KTtcbiAgY29uc3Qgbm9kZSA9IGV4aXN0aW5nTm9kZSB8fCBjcmVhdGVOb2RlKG5hbWVPckN0b3IsIGtleSwgbm9uY2UpO1xuXG4gIC8vIElmIHdlIGFyZSBhdCB0aGUgbWF0Y2hpbmcgbm9kZSwgdGhlbiB3ZSBhcmUgZG9uZS5cbiAgaWYgKG5vZGUgPT09IGN1cnJlbnROb2RlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUmUtb3JkZXIgdGhlIG5vZGUgaW50byB0aGUgcmlnaHQgcG9zaXRpb24sIHByZXNlcnZpbmcgZm9jdXMgaWYgZWl0aGVyXG4gIC8vIG5vZGUgb3IgY3VycmVudE5vZGUgYXJlIGZvY3VzZWQgYnkgbWFraW5nIHN1cmUgdGhhdCB0aGV5IGFyZSBub3QgZGV0YWNoZWRcbiAgLy8gZnJvbSB0aGUgRE9NLlxuICBpZiAoZm9jdXNQYXRoLmluZGV4T2Yobm9kZSkgPj0gMCkge1xuICAgIC8vIE1vdmUgZXZlcnl0aGluZyBlbHNlIGJlZm9yZSB0aGUgbm9kZS5cbiAgICBtb3ZlQmVmb3JlKGN1cnJlbnRQYXJlbnQhLCBub2RlLCBjdXJyZW50Tm9kZSk7XG4gIH0gZWxzZSB7XG4gICAgY3VycmVudFBhcmVudCEuaW5zZXJ0QmVmb3JlKG5vZGUsIGN1cnJlbnROb2RlKTtcbiAgfVxuXG4gIGN1cnJlbnROb2RlID0gbm9kZTtcbn1cblxuLyoqXG4gKiBNYWtlcyBzdXJlIHRoYXQgdGhlIGN1cnJlbnQgbm9kZSBpcyBhbiBFbGVtZW50IHdpdGggYSBtYXRjaGluZyBuYW1lT3JDdG9yIGFuZFxuICoga2V5LlxuICpcbiAqIEBwYXJhbSBuYW1lT3JDdG9yIFRoZSB0YWcgb3IgY29uc3RydWN0b3IgZm9yIHRoZSBFbGVtZW50LlxuICogQHBhcmFtIGtleSBUaGUga2V5IHVzZWQgdG8gaWRlbnRpZnkgdGhpcyBlbGVtZW50LiBUaGlzIGNhbiBiZSBhblxuICogICAgIGVtcHR5IHN0cmluZywgYnV0IHBlcmZvcm1hbmNlIG1heSBiZSBiZXR0ZXIgaWYgYSB1bmlxdWUgdmFsdWUgaXMgdXNlZFxuICogICAgIHdoZW4gaXRlcmF0aW5nIG92ZXIgYW4gYXJyYXkgb2YgaXRlbXMuXG4gKiBAcGFyYW0gbm9uY2UgVGhlIG5vbmNlIGF0dHJpYnV0ZSBmb3IgdGhlIGVsZW1lbnQuXG4gKiBAcmV0dXJuIFRoZSBjb3JyZXNwb25kaW5nIEVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIG9wZW4oXG4gIG5hbWVPckN0b3I6IE5hbWVPckN0b3JEZWYsXG4gIGtleT86IEtleSxcbiAgbm9uY2U/OiBzdHJpbmdcbik6IEhUTUxFbGVtZW50IHtcbiAgYWxpZ25XaXRoRE9NKG5hbWVPckN0b3IsIGtleSwgbm9uY2UpO1xuICBlbnRlck5vZGUoKTtcbiAgcmV0dXJuIGN1cnJlbnRQYXJlbnQgYXMgSFRNTEVsZW1lbnQ7XG59XG5cbi8qKlxuICogQ2xvc2VzIHRoZSBjdXJyZW50bHkgb3BlbiBFbGVtZW50LCByZW1vdmluZyBhbnkgdW52aXNpdGVkIGNoaWxkcmVuIGlmXG4gKiBuZWNlc3NhcnkuXG4gKiBAcmV0dXJucyBUaGUgRWxlbWVudCB0aGF0IHdhcyBqdXN0IGNsb3NlZC5cbiAqL1xuZnVuY3Rpb24gY2xvc2UoKTogRWxlbWVudCB7XG4gIGlmIChERUJVRykge1xuICAgIHNldEluU2tpcChmYWxzZSk7XG4gIH1cblxuICBleGl0Tm9kZSgpO1xuICByZXR1cm4gY3VycmVudE5vZGUgYXMgRWxlbWVudDtcbn1cblxuLyoqXG4gKiBNYWtlcyBzdXJlIHRoZSBjdXJyZW50IG5vZGUgaXMgYSBUZXh0IG5vZGUgYW5kIGNyZWF0ZXMgYSBUZXh0IG5vZGUgaWYgaXQgaXNcbiAqIG5vdC5cbiAqIEByZXR1cm5zIFRoZSBUZXh0IG5vZGUgdGhhdCB3YXMgYWxpZ25lZCBvciBjcmVhdGVkLlxuICovXG5mdW5jdGlvbiB0ZXh0KCk6IFRleHQge1xuICBhbGlnbldpdGhET00oXCIjdGV4dFwiLCBudWxsKTtcbiAgcmV0dXJuIGN1cnJlbnROb2RlIGFzIFRleHQ7XG59XG5cbi8qKlxuICogQHJldHVybnMgVGhlIGN1cnJlbnQgRWxlbWVudCBiZWluZyBwYXRjaGVkLlxuICovXG5mdW5jdGlvbiBjdXJyZW50RWxlbWVudCgpOiBFbGVtZW50IHtcbiAgaWYgKERFQlVHKSB7XG4gICAgYXNzZXJ0SW5QYXRjaChcImN1cnJlbnRFbGVtZW50XCIpO1xuICAgIGFzc2VydE5vdEluQXR0cmlidXRlcyhcImN1cnJlbnRFbGVtZW50XCIpO1xuICB9XG4gIHJldHVybiBjdXJyZW50UGFyZW50IGFzIEVsZW1lbnQ7XG59XG5cbi8qKlxuICogQHJldHVybnMgVGhlIGN1cnJlbnQgRWxlbWVudCBiZWluZyBwYXRjaGVkLCBvciBudWxsIGlmIG5vIHBhdGNoIGlzIGluIHByb2dyZXNzLlxuICovXG5mdW5jdGlvbiB0cnlHZXRDdXJyZW50RWxlbWVudCgpOiBFbGVtZW50IHwgbnVsbCB7XG4gIHJldHVybiBjdXJyZW50UGFyZW50IGFzIEVsZW1lbnQgfCBudWxsO1xufVxuXG4vKipcbiAqIEByZXR1cm4gVGhlIE5vZGUgdGhhdCB3aWxsIGJlIGV2YWx1YXRlZCBmb3IgdGhlIG5leHQgaW5zdHJ1Y3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGN1cnJlbnRQb2ludGVyKCk6IE5vZGUge1xuICBpZiAoREVCVUcpIHtcbiAgICBhc3NlcnRJblBhdGNoKFwiY3VycmVudFBvaW50ZXJcIik7XG4gICAgYXNzZXJ0Tm90SW5BdHRyaWJ1dGVzKFwiY3VycmVudFBvaW50ZXJcIik7XG4gIH1cbiAgLy8gVE9ETyh0b21uZ3V5ZW4pOiBhc3NlcnQgdGhhdCB0aGlzIGlzIG5vdCBudWxsXG4gIHJldHVybiBnZXROZXh0Tm9kZSgpITtcbn1cblxuZnVuY3Rpb24gY3VycmVudENvbnRleHQoKSB7XG4gIHJldHVybiBjb250ZXh0O1xufVxuXG4vKipcbiAqIFNraXBzIHRoZSBjaGlsZHJlbiBpbiBhIHN1YnRyZWUsIGFsbG93aW5nIGFuIEVsZW1lbnQgdG8gYmUgY2xvc2VkIHdpdGhvdXRcbiAqIGNsZWFyaW5nIG91dCB0aGUgY2hpbGRyZW4uXG4gKi9cbmZ1bmN0aW9uIHNraXAoKSB7XG4gIGlmIChERUJVRykge1xuICAgIGFzc2VydE5vQ2hpbGRyZW5EZWNsYXJlZFlldChcInNraXBcIiwgY3VycmVudE5vZGUpO1xuICAgIHNldEluU2tpcCh0cnVlKTtcbiAgfVxuICBjdXJyZW50Tm9kZSA9IGN1cnJlbnRQYXJlbnQhLmxhc3RDaGlsZDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgcGF0Y2hlciBmdW5jdGlvbiB0aGF0IHNldHMgdXAgYW5kIHJlc3RvcmVzIGEgcGF0Y2ggY29udGV4dCxcbiAqIHJ1bm5pbmcgdGhlIHJ1biBmdW5jdGlvbiB3aXRoIHRoZSBwcm92aWRlZCBkYXRhLlxuICogQHBhcmFtIHJ1biBUaGUgZnVuY3Rpb24gdGhhdCB3aWxsIHJ1biB0aGUgcGF0Y2guXG4gKiBAcGFyYW0gcGF0Y2hDb25maWcgVGhlIGNvbmZpZ3VyYXRpb24gdG8gdXNlIGZvciB0aGUgcGF0Y2guXG4gKiBAcmV0dXJucyBUaGUgY3JlYXRlZCBwYXRjaCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlUGF0Y2hlcjxULCBSPihcbiAgcnVuOiBQYXRjaEZ1bmN0aW9uPFQsIFI+LFxuICBwYXRjaENvbmZpZzogUGF0Y2hDb25maWcgPSB7fVxuKTogUGF0Y2hGdW5jdGlvbjxULCBSPiB7XG4gIGNvbnN0IHsgbWF0Y2hlcyA9IGRlZmF1bHRNYXRjaEZuIH0gPSBwYXRjaENvbmZpZztcblxuICBjb25zdCBmOiBQYXRjaEZ1bmN0aW9uPFQsIFI+ID0gKG5vZGUsIGZuLCBkYXRhKSA9PiB7XG4gICAgY29uc3QgcHJldkNvbnRleHQgPSBjb250ZXh0O1xuICAgIGNvbnN0IHByZXZEb2MgPSBkb2M7XG4gICAgY29uc3QgcHJldkZvY3VzUGF0aCA9IGZvY3VzUGF0aDtcbiAgICBjb25zdCBwcmV2QXJnc0J1aWxkZXIgPSBhcmdzQnVpbGRlcjtcbiAgICBjb25zdCBwcmV2QXR0cnNCdWlsZGVyID0gYXR0cnNCdWlsZGVyO1xuICAgIGNvbnN0IHByZXZDdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlO1xuICAgIGNvbnN0IHByZXZDdXJyZW50UGFyZW50ID0gY3VycmVudFBhcmVudDtcbiAgICBjb25zdCBwcmV2TWF0Y2hGbiA9IG1hdGNoRm47XG4gICAgbGV0IHByZXZpb3VzSW5BdHRyaWJ1dGVzID0gZmFsc2U7XG4gICAgbGV0IHByZXZpb3VzSW5Ta2lwID0gZmFsc2U7XG5cbiAgICBkb2MgPSBub2RlLm93bmVyRG9jdW1lbnQ7XG4gICAgY29udGV4dCA9IG5ldyBDb250ZXh0KG5vZGUpO1xuICAgIG1hdGNoRm4gPSBtYXRjaGVzO1xuICAgIGFyZ3NCdWlsZGVyID0gW107XG4gICAgYXR0cnNCdWlsZGVyID0gW107XG4gICAgY3VycmVudE5vZGUgPSBudWxsO1xuICAgIGN1cnJlbnRQYXJlbnQgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgZm9jdXNQYXRoID0gZ2V0Rm9jdXNlZFBhdGgobm9kZSwgY3VycmVudFBhcmVudCk7XG5cbiAgICBpZiAoREVCVUcpIHtcbiAgICAgIHByZXZpb3VzSW5BdHRyaWJ1dGVzID0gc2V0SW5BdHRyaWJ1dGVzKGZhbHNlKTtcbiAgICAgIHByZXZpb3VzSW5Ta2lwID0gc2V0SW5Ta2lwKGZhbHNlKTtcbiAgICAgIHVwZGF0ZVBhdGNoQ29udGV4dChjb250ZXh0KTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmV0VmFsID0gcnVuKG5vZGUsIGZuLCBkYXRhKTtcbiAgICAgIGlmIChERUJVRykge1xuICAgICAgICBhc3NlcnRWaXJ0dWFsQXR0cmlidXRlc0Nsb3NlZCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmV0VmFsO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBjb250ZXh0Lm5vdGlmeUNoYW5nZXMoKTtcblxuICAgICAgZG9jID0gcHJldkRvYztcbiAgICAgIGNvbnRleHQgPSBwcmV2Q29udGV4dDtcbiAgICAgIG1hdGNoRm4gPSBwcmV2TWF0Y2hGbjtcbiAgICAgIGFyZ3NCdWlsZGVyID0gcHJldkFyZ3NCdWlsZGVyO1xuICAgICAgYXR0cnNCdWlsZGVyID0gcHJldkF0dHJzQnVpbGRlcjtcbiAgICAgIGN1cnJlbnROb2RlID0gcHJldkN1cnJlbnROb2RlO1xuICAgICAgY3VycmVudFBhcmVudCA9IHByZXZDdXJyZW50UGFyZW50O1xuICAgICAgZm9jdXNQYXRoID0gcHJldkZvY3VzUGF0aDtcblxuICAgICAgLy8gTmVlZHMgdG8gYmUgZG9uZSBhZnRlciBhc3NlcnRpb25zIGJlY2F1c2UgYXNzZXJ0aW9ucyByZWx5IG9uIHN0YXRlXG4gICAgICAvLyBmcm9tIHRoZXNlIG1ldGhvZHMuXG4gICAgICBpZiAoREVCVUcpIHtcbiAgICAgICAgc2V0SW5BdHRyaWJ1dGVzKHByZXZpb3VzSW5BdHRyaWJ1dGVzKTtcbiAgICAgICAgc2V0SW5Ta2lwKHByZXZpb3VzSW5Ta2lwKTtcbiAgICAgICAgdXBkYXRlUGF0Y2hDb250ZXh0KGNvbnRleHQpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGY7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHBhdGNoZXIgdGhhdCBwYXRjaGVzIHRoZSBkb2N1bWVudCBzdGFydGluZyBhdCBub2RlIHdpdGggYVxuICogcHJvdmlkZWQgZnVuY3Rpb24uIFRoaXMgZnVuY3Rpb24gbWF5IGJlIGNhbGxlZCBkdXJpbmcgYW4gZXhpc3RpbmcgcGF0Y2ggb3BlcmF0aW9uLlxuICogQHBhcmFtIHBhdGNoQ29uZmlnIFRoZSBjb25maWcgdG8gdXNlIGZvciB0aGUgcGF0Y2guXG4gKiBAcmV0dXJucyBUaGUgY3JlYXRlZCBmdW5jdGlvbiBmb3IgcGF0Y2hpbmcgYW4gRWxlbWVudCdzIGNoaWxkcmVuLlxuICovXG5mdW5jdGlvbiBjcmVhdGVQYXRjaElubmVyPFQ+KFxuICBwYXRjaENvbmZpZz86IFBhdGNoQ29uZmlnXG4pOiBQYXRjaEZ1bmN0aW9uPFQsIE5vZGU+IHtcbiAgcmV0dXJuIGNyZWF0ZVBhdGNoZXIoKG5vZGUsIGZuLCBkYXRhKSA9PiB7XG4gICAgY3VycmVudE5vZGUgPSBub2RlO1xuXG4gICAgZW50ZXJOb2RlKCk7XG4gICAgZm4oZGF0YSk7XG4gICAgZXhpdE5vZGUoKTtcblxuICAgIGlmIChERUJVRykge1xuICAgICAgYXNzZXJ0Tm9VbmNsb3NlZFRhZ3MoY3VycmVudE5vZGUsIG5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9LCBwYXRjaENvbmZpZyk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHBhdGNoZXIgdGhhdCBwYXRjaGVzIGFuIEVsZW1lbnQgd2l0aCB0aGUgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uLlxuICogRXhhY3RseSBvbmUgdG9wIGxldmVsIGVsZW1lbnQgY2FsbCBzaG91bGQgYmUgbWFkZSBjb3JyZXNwb25kaW5nIHRvIGBub2RlYC5cbiAqIEBwYXJhbSBwYXRjaENvbmZpZyBUaGUgY29uZmlnIHRvIHVzZSBmb3IgdGhlIHBhdGNoLlxuICogQHJldHVybnMgVGhlIGNyZWF0ZWQgZnVuY3Rpb24gZm9yIHBhdGNoaW5nIGFuIEVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVBhdGNoT3V0ZXI8VD4oXG4gIHBhdGNoQ29uZmlnPzogUGF0Y2hDb25maWdcbik6IFBhdGNoRnVuY3Rpb248VCwgTm9kZSB8IG51bGw+IHtcbiAgcmV0dXJuIGNyZWF0ZVBhdGNoZXIoKG5vZGUsIGZuLCBkYXRhKSA9PiB7XG4gICAgY29uc3Qgc3RhcnROb2RlID0gKHsgbmV4dFNpYmxpbmc6IG5vZGUgfSBhcyBhbnkpIGFzIEVsZW1lbnQ7XG4gICAgbGV0IGV4cGVjdGVkTmV4dE5vZGU6IE5vZGUgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgZXhwZWN0ZWRQcmV2Tm9kZTogTm9kZSB8IG51bGwgPSBudWxsO1xuXG4gICAgaWYgKERFQlVHKSB7XG4gICAgICBleHBlY3RlZE5leHROb2RlID0gbm9kZS5uZXh0U2libGluZztcbiAgICAgIGV4cGVjdGVkUHJldk5vZGUgPSBub2RlLnByZXZpb3VzU2libGluZztcbiAgICB9XG5cbiAgICBjdXJyZW50Tm9kZSA9IHN0YXJ0Tm9kZTtcbiAgICBmbihkYXRhKTtcblxuICAgIGlmIChERUJVRykge1xuICAgICAgaWYgKGdldERhdGEobm9kZSkua2V5KSB7XG4gICAgICAgIGFzc2VydFBhdGNoT3V0ZXJIYXNQYXJlbnROb2RlKGN1cnJlbnRQYXJlbnQpO1xuICAgICAgfVxuICAgICAgYXNzZXJ0UGF0Y2hFbGVtZW50Tm9FeHRyYXMoXG4gICAgICAgIHN0YXJ0Tm9kZSxcbiAgICAgICAgY3VycmVudE5vZGUsXG4gICAgICAgIGV4cGVjdGVkTmV4dE5vZGUsXG4gICAgICAgIGV4cGVjdGVkUHJldk5vZGVcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnRQYXJlbnQpIHtcbiAgICAgIGNsZWFyVW52aXNpdGVkRE9NKGN1cnJlbnRQYXJlbnQsIGdldE5leHROb2RlKCksIG5vZGUubmV4dFNpYmxpbmcpO1xuICAgIH1cblxuICAgIHJldHVybiBzdGFydE5vZGUgPT09IGN1cnJlbnROb2RlID8gbnVsbCA6IGN1cnJlbnROb2RlO1xuICB9LCBwYXRjaENvbmZpZyk7XG59XG5cbmNvbnN0IHBhdGNoSW5uZXI6IDxUPihcbiAgbm9kZTogRWxlbWVudCB8IERvY3VtZW50RnJhZ21lbnQsXG4gIHRlbXBsYXRlOiAoYTogVCB8IHVuZGVmaW5lZCkgPT4gdm9pZCxcbiAgZGF0YT86IFQgfCB1bmRlZmluZWRcbikgPT4gTm9kZSA9IGNyZWF0ZVBhdGNoSW5uZXIoKTtcbmNvbnN0IHBhdGNoT3V0ZXI6IDxUPihcbiAgbm9kZTogRWxlbWVudCB8IERvY3VtZW50RnJhZ21lbnQsXG4gIHRlbXBsYXRlOiAoYTogVCB8IHVuZGVmaW5lZCkgPT4gdm9pZCxcbiAgZGF0YT86IFQgfCB1bmRlZmluZWRcbikgPT4gTm9kZSB8IG51bGwgPSBjcmVhdGVQYXRjaE91dGVyKCk7XG5cbmV4cG9ydCB7XG4gIGFsaWduV2l0aERPTSxcbiAgYWx3YXlzRGlmZkF0dHJpYnV0ZXMsXG4gIGdldEFyZ3NCdWlsZGVyLFxuICBnZXRBdHRyc0J1aWxkZXIsXG4gIHRleHQsXG4gIGNyZWF0ZVBhdGNoSW5uZXIsXG4gIGNyZWF0ZVBhdGNoT3V0ZXIsXG4gIHBhdGNoSW5uZXIsXG4gIHBhdGNoT3V0ZXIsXG4gIG9wZW4sXG4gIGNsb3NlLFxuICBjdXJyZW50RWxlbWVudCxcbiAgY3VycmVudENvbnRleHQsXG4gIGN1cnJlbnRQb2ludGVyLFxuICBza2lwLFxuICBuZXh0Tm9kZSBhcyBza2lwTm9kZSxcbiAgdHJ5R2V0Q3VycmVudEVsZW1lbnRcbn07XG4iXX0=