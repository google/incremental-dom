//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import { AttrMutatorConfig } from "./types";
import { createMap, truncateArray } from "./util";
import { flush, queueChange } from "./changes";

/**
 * Used to keep track of the previous values when a 2-way diff is necessary.
 * This object is cleared out and reused.
 */
const prevValuesMap = createMap();

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
function calculateDiff<T>(
  prev: Array<string>,
  next: Array<string>,
  updateCtx: T,
  updateFn: (
    ctx: T,
    x: string,
    y: {} | undefined,
    attrs: AttrMutatorConfig
  ) => void,
  attrs: AttrMutatorConfig,
  alwaysDiffAttributes: boolean = false
) {
  const isNew = !prev.length || alwaysDiffAttributes;
  let i = 0;

  for (; i < next.length; i += 2) {
    const name = next[i];
    if (isNew) {
      prev[i] = name;
    } else if (prev[i] !== name) {
      break;
    }

    const value = next[i + 1];
    if (isNew || prev[i + 1] !== value) {
      prev[i + 1] = value;
      queueChange(updateFn, updateCtx, name, value, attrs);
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
      const name = next[i] as string;
      const value = next[i + 1];

      if (prevValuesMap[name] !== value) {
        queueChange(updateFn, updateCtx, name, value, attrs);
      }

      prev[i] = name;
      prev[i + 1] = value;

      delete prevValuesMap[name];
    }

    truncateArray(prev, next.length);

    for (const name in prevValuesMap) {
      queueChange(updateFn, updateCtx, name, undefined, attrs);
      delete prevValuesMap[name];
    }
  }

  flush();
}

export { calculateDiff };
