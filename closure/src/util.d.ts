/** @license SPDX-License-Identifier: Apache-2.0 */
/**
 * Used to prevent property collisions between our "map" and its prototype.
 * @param map The map to check.
 * @param property The property to check.
 * @return Whether map has property.
 */
declare function has(map: object, property: string): boolean;
/**
 * Creates an map object without a prototype.
 * @returns An Object that can be used as a map.
 */
declare function createMap(): any;
/**
 * Truncates an array, removing items up until length.
 * @param arr The array to truncate.
 * @param length The new length of the array.
 */
declare function truncateArray(arr: Array<{} | null | undefined>, length: number): void;
/**
 * Creates an array for a desired initial size. Note that the array will still
 * be empty.
 * @param initialAllocationSize The initial size to allocate.
 * @returns An empty array, with an initial allocation for the desired size.
 */
declare function createArray<T>(initialAllocationSize: number): Array<T>;
export { createArray, createMap, has, truncateArray };
