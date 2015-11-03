/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
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

import { notifications } from './notifications';


/**
 * Keeps track of the state of a patch.
 * @constructor
 */
function Context() {
  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.created = notifications.nodesCreated && [];

  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.deleted = notifications.nodesDeleted && [];
}


/**
 * @param {!Node} node
 */
Context.prototype.markCreated = function(node) {
  if (this.created) {
    this.created.push(node);
  }
};


/**
 * @param {!Node} node
 */
Context.prototype.markDeleted = function(node) {
  if (this.deleted) {
    this.deleted.push(node);
  }
};


/**
 * Notifies about nodes that were created during the patch opearation.
 */
Context.prototype.notifyChanges = function() {
  if (this.created && this.created.length > 0) {
    notifications.nodesCreated(this.created);
  }

  if (this.deleted && this.deleted.length > 0) {
    notifications.nodesDeleted(this.deleted);
  }
};


/** */
export {
  Context
};
