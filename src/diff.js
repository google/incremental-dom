/**
 * Copyright 2017 The Incremental DOM Authors. All Rights Reserved.
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


import { createMap } from './util';


/**
 * Used to keep track of the previous values when a 2-way diff is necessary.
 * This object is cleared out and reused.
 * @const {Object<*>}
 */
const prevValuesMap = createMap();


/**
 * Calculates the diff between previous and next values, calling the update
 * function when an item has changed value. If an item from the previous values
 * is not present in the the next values, the update function is called with a
 * value of `undefined`.
 * @param {Array<*>} prev The previous values, alternating name, value pairs.
 * @param {Array<*>} next The next values, alternating name, value pairs.
 * @param {T} updateCtx The context for the updateFn.
 * @param {function(T, string, *)} updateFn A function to call when a value has
 *     changed.
 * @template T
 */
const calculateDiff = function(prev, next, updateCtx, updateFn) {
  const isNew = !prev.length;
  let i = 0;

  for (; i < next.length; i += 2) {
    const name = /** @type {string} */(next[i]);
    if (isNew) {
      prev[i] = name;
    } else if (prev[i] !== name) {
      break;
    }

    const value = next[i + 1];
    if (isNew || prev[i + 1] !== value) {
      prev[i + 1] = value;
      updateFn(updateCtx, name, value);
    }
  }

  // Items did not line up exactly as before, need to make sure old items are
  // removed. This should be a rare case.
  if (i < next.length || i < prev.length) {
    const startIndex = i;

    for (i = startIndex; i < prev.length; i += 2) {
      prevValuesMap[prev[i]] = prev[i + 1];
    }

    for (i = startIndex; i < next.length; i += 2) {
      const name = /** @type {string} */(next[i]);
      const value = next[i + 1];

      if (prevValuesMap[name] !== value) {
        updateFn(updateCtx, name, value);
      }

      prev[i] = name;
      prev[i + 1] = value;

      delete prevValuesMap[name];
    }

    if (next.length < prev.length) {
      prev.length = next.length;
    }

    for (const name in prevValuesMap) {
      updateFn(updateCtx, name, undefined);
      delete prevValuesMap[name];
    }
  }
};


/** */
export {
  calculateDiff
};
