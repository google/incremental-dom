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

import { truncateArray } from './util.js';


/** @type {!Array<*>} */
const buffer = [];

/** @type {number} */
let bufferStart = 0;


/**
 * @param {!function(A, B, C)} fn The function to call.
 * @param {A} a The first argument
 * @param {B} b The second argument
 * @param {C} c The third argument
 * @template A, B, C
 */
const queueChange = function(fn, a, b, c) {
  buffer.push(fn);
  buffer.push(a);
  buffer.push(b);
  buffer.push(c);
};


/**
 * Flushes the changes buffer, calling the functions for each change.
 */
const flush = function() {
  // A change may cause this function to be called re-entrantly. Keep track of
  // the portion of the buffer we are consuming. Updates the start pointer so
  // that the next call knows where to start from.
  const start = bufferStart;
  const end = buffer.length;

  bufferStart = end;

  for (let i = start; i < end; i += 4) {
    const fn = /** @type {!function(*, *, *)} */ (buffer[i]);
    fn(buffer[i + 1], buffer[i + 2], buffer[i + 3]);
  }

  bufferStart = start;
  truncateArray(buffer, start);
};


/** */
export {
  queueChange,
  flush
};
