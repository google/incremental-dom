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

import { truncateArray } from "./util";

const buffer: Array<any> = [];

let bufferStart = 0;

/**
 * TODO(tomnguyen): This is a bit silly and really needs to be better typed.
 * @param fn A function to call.
 * @param a The first argument to the function.
 * @param b The second argument to the function.
 * @param c The third argument to the function.
 */
function queueChange<A, B, C>(
  fn: (a: A, b: B, c: C) => void,
  a: A,
  b: B,
  c: C
) {
  buffer.push(fn);
  buffer.push(a);
  buffer.push(b);
  buffer.push(c);
}

/**
 * Flushes the changes buffer, calling the functions for each change.
 */
function flush() {
  // A change may cause this function to be called re-entrantly. Keep track of
  // the portion of the buffer we are consuming. Updates the start pointer so
  // that the next call knows where to start from.
  const start = bufferStart;
  const end = buffer.length;

  bufferStart = end;

  for (let i = start; i < end; i += 4) {
    const fn = buffer[i] as (a: any, b: any, c: any) => undefined;
    fn(buffer[i + 1], buffer[i + 2], buffer[i + 3]);
  }

  bufferStart = start;
  truncateArray(buffer, start);
}

export { queueChange, flush };
