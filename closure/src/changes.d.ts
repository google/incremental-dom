/** @license SPDX-License-Identifier: Apache-2.0 */
/**
 * TODO(tomnguyen): This is a bit silly and really needs to be better typed.
 * @param fn A function to call.
 * @param a The first argument to the function.
 * @param b The second argument to the function.
 * @param c The third argument to the function.
 * @param d The fourth argument to the function
 */
declare function queueChange<A, B, C, D>(fn: (a: A, b: B, c: C, d: D) => void, a: A, b: B, c: C, d: D): void;
/**
 * Flushes the changes buffer, calling the functions for each change.
 */
declare function flush(): void;
export { queueChange, flush };
