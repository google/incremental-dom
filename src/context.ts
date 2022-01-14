//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import { notifications } from "./notifications";

/**
 * A context object keeps track of the state of a patch.
 */
class Context {
  private created: Array<Node> = [];
  private deleted: Array<Node> = [];
  public readonly node: Element | DocumentFragment;

  public constructor(node: Element | DocumentFragment) {
    this.node = node;
  }

  public markCreated(node: Node) {
    this.created.push(node);
  }

  public markDeleted(node: Node) {
    this.deleted.push(node);
  }

  /**
   * Notifies about nodes that were created during the patch operation.
   */
  public notifyChanges() {
    if (notifications.nodesCreated && this.created.length > 0) {
      notifications.nodesCreated(this.created);
    }

    if (notifications.nodesDeleted && this.deleted.length > 0) {
      notifications.nodesDeleted(this.deleted);
    }
  }
}

export { Context };
