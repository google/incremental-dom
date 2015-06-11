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

var patch = require('./src/patch').patch;
var elements = require('./src/virtual_elements');

module.exports = {
  patch: patch,
  ie_void: elements.ie_void,
  ie_open_start: elements.ie_open_start,
  ie_open_end: elements.ie_open_end,
  ie_open: elements.ie_open,
  ie_close: elements.ie_close,
  ie_component: elements.ie_component,
  itext: elements.itext,
  iattr: elements.iattr
};

