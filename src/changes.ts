//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import { truncateArray } from "./util";

const buffer: Array<any> = [];

let bufferStart = 0;

/**
 * TODO(tomnguyen): This is a bit silly and really needs to be better typed.
 * @param fn A function to call.
 * @param a The first argument to the function.
 * @param b The second argument to the function.
 * @param c The third argument to the function.
 * @param d The fourth argument to the function
 */
function queueChange<A, B, C, D>(
  fn: (a: A, b: B, c: C, d: D) => void,
  a: A,
  b: B,
  c: C,
  d: D
) {
  buffer.push(fn);
  buffer.push(a);
  buffer.push(b);
  buffer.push(c);
  buffer.push(d);
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

  for (let i = start; i < end; i += 5) {
    const fn = buffer[i] as (a: any, b: any, c: any, d: any) => undefined;
    fn(buffer[i + 1], buffer[i + 2], buffer[i + 3], buffer[i + 4]);
  }

  bufferStart = start;
  truncateArray(buffer, start);
}

export { queueChange, flush };
