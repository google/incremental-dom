//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

/**
 * A cached reference to the hasOwnProperty function.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * A constructor function that will create blank objects.
 */
function Blank() {}

Blank.prototype = Object.create(null);

/**
 * Used to prevent property collisions between our "map" and its prototype.
 * @param map The map to check.
 * @param property The property to check.
 * @return Whether map has property.
 */
function has(map: object, property: string): boolean {
  return hasOwnProperty.call(map, property);
}

/**
 * Creates an map object without a prototype.
 * @returns An Object that can be used as a map.
 */
function createMap(): any {
  return new (Blank as any)();
}

/**
 * Truncates an array, removing items up until length.
 * @param arr The array to truncate.
 * @param length The new length of the array.
 */
function truncateArray(arr: Array<{} | null | undefined>, length: number) {
  while (arr.length > length) {
    arr.pop();
  }
}

/**
 * Creates an array for a desired initial size. Note that the array will still
 * be empty.
 * @param initialAllocationSize The initial size to allocate.
 * @returns An empty array, with an initial allocation for the desired size.
 */
function createArray<T>(initialAllocationSize: number): Array<T> {
  const arr = new Array(initialAllocationSize);
  truncateArray(arr, 0);
  return arr;
}

export { createArray, createMap, has, truncateArray };
