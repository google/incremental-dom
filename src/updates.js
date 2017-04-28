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

import { getData } from './node_data.js';
import { currentElement } from './core.js';
import { calculateDiff } from './diff.js';
import {
  applyAttr,
  applyProp
} from './attributes.js';
import {
  queueChange,
  flush
} from './changes.js';
import { truncateArray } from './util.js';


/** @type {!Array<*>} */
const attributes = [];

/** @type {!Array<*>} */
const properties = [];


/**
 * Buffers an attribute, saving it to be applied later.
 * @param {string} name
 * @param {*} value
 */
const bufferAttribute = function(name, value) {
  attributes.push(name);
  attributes.push(value);
};


/**
 * Buffers an attribute, saving it to be applied later.
 * @param {string} name
 * @param {*} value
 */
const bufferProperty = function(name, value) {
  properties.push(name);
  properties.push(value);
};


/**
 * @type {function(!Element, string, *)}
 */
const queueAttribute = queueChange.bind(null, applyAttr);


/**
 * @type {function(!Element, string, *)}
 */
const queueProperty = queueChange.bind(null, applyProp);


/**
 * Queues up any diffs for the current element and buffered attributes. These
 * can be apply by calling `flush()`;
 */
const queueUpdates = function() {
  const node = currentElement();
  const data = getData(node);
  const attributesArr = data.attrsArr;
  const propertiesArr = data.propertiesArr;

  calculateDiff(attributesArr, attributes, node, queueAttribute);
  calculateDiff(propertiesArr, properties, node, queueProperty);
  truncateArray(attributes, 0);
  truncateArray(properties, 0);
};


/**
 * Immediately applies any diffs for the current element and buffered
 * attributes.
 */
const applyUpdates = function() {
  queueUpdates();
  flush();
};

/** */
export {
  applyUpdates,
  bufferAttribute,
  bufferProperty,
  queueAttribute,
  queueProperty,
  queueUpdates,
};
