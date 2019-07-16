/**
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
