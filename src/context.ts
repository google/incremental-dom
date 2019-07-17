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

import { notifications } from "./notifications";

/**
 * A context object keeps track of the state of a patch.
 */
class Context {
  private created: Array<Node> = [];
  private deleted: Array<Node> = [];

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
