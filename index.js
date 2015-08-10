/**
 * @license
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

export { patch } from './src/patch';
export {
  elementVoid,
  elementOpenStart,
  elementOpenEnd,
  elementOpen,
  elementClose,
  text,
  attr,
} from './src/virtual_elements';


import {
  mutators as attrMutators,
  defaults as attrDefaults
} from './src/attributes';


var mutators = {
  attributes: attrMutators
};

var defaults = {
  attributes: attrDefaults
};

export {
  mutators,
  defaults
};

