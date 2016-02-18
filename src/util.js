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


/**
 * A cached reference to the hasOwnProperty function.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;


/**
 * A cached reference to the create function.
 */
const create = Object.create;


/**
 * Used to prevent property collisions between our "map" and its prototype.
 * @param {!Object<string, *>} map The map to check.
 * @param {string} property The property to check.
 * @return {boolean} Whether map has property.
 */
const has = function(map, property) {
  return hasOwnProperty.call(map, property);
};


/**
 * Creates an map object without a prototype.
 * @return {!Object}
 */
const createMap = function() {
  return create(null);
};


/** */
export {
  createMap,
  has
};

