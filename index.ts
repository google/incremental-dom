/**
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
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

export {applyAttr, applyProp, attributes,} from './src/attributes';
export {alignWithDOM, close, createPatchInner, createPatchOuter, currentElement, currentPointer, open, patchInner as patch, patchInner, patchOuter, skip, skipNode} from './src/core';
export {setKeyAttributeName} from './src/global';
export {clearCache,getKey, importNode, isDataInitialized} from './src/node_data';
export {notifications} from './src/notifications';
export {symbols} from './src/symbols';
export {applyAttrs, applyStatics, attr, elementClose, elementOpen, elementOpenEnd, elementOpenStart, elementVoid, key, text} from './src/virtual_elements';
export * from './src/types';
