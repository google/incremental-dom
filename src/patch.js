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

import {
    firstChild,
    parentNode
} from './traversal';
import { TreeWalker } from './tree_walker';
import {
    enterContext,
    restoreContext
} from './context';
import { clearUnvisitedDOM } from './alignment';
import { notifications } from './notifications';
import { assertNoUnclosedTags } from './assertions';


/**
 * Patches the document starting at el with the provided function. This function
 * may be called during an existing patch operation.
 * @param {!Element|!DocumentFragment} node The Element or Document
 *     to patch.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @template T
 */
var patch = function(node, fn, data) {
  var context = enterContext(node);

  firstChild();
  fn(data);
  parentNode();
  clearUnvisitedDOM(node);

  if (process.env.NODE_ENV !== 'production') {
    assertNoUnclosedTags(context.walker.currentNode, node);
  }

  context.notifyChanges();
  restoreContext();
};


/** */
export {
  patch
};
