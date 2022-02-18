/** @license SPDX-License-Identifier: Apache-2.0 */
import { AttrMutatorConfig } from "./types";
/**
 * Calculates the diff between previous and next values, calling the update
 * function when an item has changed value. If an item from the previous values
 * is not present in the the next values, the update function is called with a
 * value of `undefined`.
 * @param prev The previous values, alternating name, value pairs.
 * @param next The next values, alternating name, value pairs.
 * @param updateCtx The context for the updateFn.
 * @param updateFn A function to call when a value has changed.
 * @param attrs Attribute map for mutators
 * @param alwaysDiffAttributes Whether to diff attributes unconditionally
 */
declare function calculateDiff<T>(prev: Array<string>, next: Array<string>, updateCtx: T, updateFn: (ctx: T, x: string, y: {} | undefined, attrs: AttrMutatorConfig) => void, attrs: AttrMutatorConfig, alwaysDiffAttributes?: boolean): void;
export { calculateDiff };
