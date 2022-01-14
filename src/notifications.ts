//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

export type NodeFunction = (n: Array<Node>) => void;

export interface Notifications {
  /**
   * Called after patch has completed with any Nodes that have been created
   * and added to the DOM.
   */
  nodesCreated: NodeFunction | null;
  /**
   * Called after patch has completed with any Nodes that have been removed
   * from the DOM.
   * Note it's an application's responsibility to handle any childNodes.
   */
  nodesDeleted: NodeFunction | null;
}

export const notifications: Notifications = {
  nodesCreated: null,
  nodesDeleted: null
};
