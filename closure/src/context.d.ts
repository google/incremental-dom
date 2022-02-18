/** @license SPDX-License-Identifier: Apache-2.0 */
/**
 * A context object keeps track of the state of a patch.
 */
declare class Context {
    private created;
    private deleted;
    readonly node: Element | DocumentFragment;
    constructor(node: Element | DocumentFragment);
    markCreated(node: Node): void;
    markDeleted(node: Node): void;
    /**
     * Notifies about nodes that were created during the patch operation.
     */
    notifyChanges(): void;
}
export { Context };
