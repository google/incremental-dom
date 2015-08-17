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

import {
  defaults as attributes
} from './attributes';


/**
 * Publicly exports the default mutators from various internal modules.
 * Note that mutating these objects will have no affect on the internal code,
 * these are exposed only to be used by custom mutators.
 * {Object<string, Object<string, function>>}
 */
var defaults = {
  attributes: attributes
};


/** */
export {
  defaults
};

