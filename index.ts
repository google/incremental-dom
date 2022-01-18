//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

export {applyAttr, applyProp, attributes, createAttributeMap} from './src/attributes';
export {alignWithDOM, alwaysDiffAttributes, close, createPatchInner, createPatchOuter, currentElement, currentContext, currentPointer, open, patchInner as patch, patchInner, patchOuter, skip, skipNode, tryGetCurrentElement} from './src/core';
export {setKeyAttributeName} from './src/global';
export {clearCache,getKey, importNode, isDataInitialized} from './src/node_data';
export {notifications} from './src/notifications';
export {symbols} from './src/symbols';
export {applyAttrs, applyStatics, attr, elementClose, elementOpen, elementOpenEnd, elementOpenStart, elementVoid, key, text} from './src/virtual_elements';
export * from './src/types';
