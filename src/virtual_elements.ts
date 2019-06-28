/**
 * @license
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

import {assert, assertCloseMatchesOpenTag, assertInAttributes, assertNotInAttributes, assertNotInSkip, setInAttributes} from './assertions';
import {updateAttribute} from './attributes';
import {getArgsBuilder, close, open, text as coreText} from './core';
import {DEBUG} from './global';
import {getData, NodeData} from './node_data';
import {Key, NameOrCtorDef, Statics} from './types';
import {createMap, truncateArray} from './util';


/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 */
const ATTRIBUTES_OFFSET = 3;


/**
 * Used to keep track of the previous values when a 2-way diff is necessary.
 * This object is reused.
 * TODO(sparhamI) Scope this to a patch so you can call patch from an attribute
 * update.
 */
const prevAttrsMap = createMap();


/**
 * Applies the statics. When importing an Element, any existing attributes that
 * match a static are converted into a static attribute.
 * @param node The Element to apply statics for.
 * @param data The Element's data
 * @param statics The statics array,
 */
function applyStatics(node: HTMLElement, data: NodeData, statics: Statics) {
  data.staticsApplied = true;

  if (!statics || !statics.length) {
    return;
  }

  if (data.hasEmptyAttrsArr()) {
    for (let i = 0; i < statics.length; i += 2) {
      updateAttribute(node, statics[i] as string, statics[i + 1]);
    }
    return;
  }

  for (let i = 0; i < statics.length; i += 2) {
    prevAttrsMap[statics[i] as string] = i + 1;
  }

  const attrsArr = data.getAttrsArr(0);
  let j = 0;
  for (let i = 0; i < attrsArr.length; i += 2) {
    const name = attrsArr[i];
    const value = attrsArr[i + 1];
    const staticsIndex = prevAttrsMap[name];

    if (staticsIndex) {
      // For any attrs that are static and have the same value, make sure we do
      // not set them again.
      if (statics[staticsIndex] === value) {
        delete prevAttrsMap[name];
      }

      continue;
    }

    // For any attrs that are dynamic, move them up to the right place.
    attrsArr[j] = name;
    attrsArr[j + 1] = value;
    j += 2;
  }
  // Anything after `j` was either moved up already or static.
  truncateArray(attrsArr, j);

  for (const name in prevAttrsMap) {
    updateAttribute(node, name, statics[prevAttrsMap[name]]);
    delete prevAttrsMap[name];
  }
}


/**
 * @param  nameOrCtor The Element's tag or constructor.
 * @param  key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param statics An array of attribute name/value pairs of the static
 *     attributes for the Element. Attributes will only be set once when the
 *     Element is created.
 * @param varArgs, Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return The corresponding Element.
 */
function elementOpen(
    nameOrCtor: NameOrCtorDef, key?: Key,
    // Ideally we could tag statics and varArgs as an array where every odd
    // element is a string and every even element is any, but this is hard.
    // tslint:disable-next-line:no-any
    statics?: Statics, ...varArgs: any[]) {
  if (DEBUG) {
    assertNotInAttributes('elementOpen');
    assertNotInSkip('elementOpen');
  }

  const node = open(nameOrCtor, key);
  const data = getData(node);

  if (!data.staticsApplied) {
    applyStatics(node, data, statics);
  }

  const attrsLength = Math.max(0, arguments.length - ATTRIBUTES_OFFSET);
  const hadNoAttrs = data.hasEmptyAttrsArr();

  if (!attrsLength && hadNoAttrs) {
    return node;
  }

  const attrsArr = data.getAttrsArr(attrsLength);

  /*
   * Checks to see if one or more attributes have changed for a given Element.
   * When no attributes have changed, this is much faster than checking each
   * individual argument. When attributes have changed, the overhead of this is
   * minimal.
   */
  let i = ATTRIBUTES_OFFSET;
  let j = 0;

  for (; i < arguments.length; i += 2, j += 2) {
    const name = arguments[i];
    if (hadNoAttrs) {
      attrsArr[j] = name;
    } else if (attrsArr[j] !== name) {
      break;
    }

    const value = arguments[i + 1];
    if (hadNoAttrs || attrsArr[j + 1] !== value) {
      attrsArr[j + 1] = value;
      updateAttribute(node, name, value);
    }
  }

  /*
   * Items did not line up exactly as before, need to make sure old items are
   * removed. This can happen if using conditional logic when declaring
   * attrs through the elementOpenStart flow or if one element is reused in
   * the place of another.
   */
  if (i < arguments.length || j < attrsArr.length) {
    const attrsStart = j;

    for (; j < attrsArr.length; j += 2) {
      prevAttrsMap[attrsArr[j]] = attrsArr[j + 1];
    }

    for (j = attrsStart; i < arguments.length; i += 2, j += 2) {
      const name = arguments[i];
      const value = arguments[i + 1];

      if (prevAttrsMap[name] !== value) {
        updateAttribute(node, name, value);
      }

      attrsArr[j] = name;
      attrsArr[j + 1] = value;

      delete prevAttrsMap[name];
    }

    truncateArray(attrsArr, j);

    /*
     * At this point, only have attributes that were present before, but have
     * been removed.
     */
    for (const name in prevAttrsMap) {
      updateAttribute(node, name, undefined);
      delete prevAttrsMap[name];
    }
  }

  return node;
}


/**
 * Declares a virtual Element at the current location in the document. This
 * corresponds to an opening tag and a elementClose tag is required. This is
 * like elementOpen, but the attributes are defined using the attr function
 * rather than being passed as arguments. Must be folllowed by 0 or more calls
 * to attr, then a call to elementOpenEnd.
 * @param nameOrCtor The Element's tag or constructor.
 * @param key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param statics An array of attribute name/value pairs of the static
 *     attributes for the Element. Attributes will only be set once when the
 *     Element is created.
 */
function elementOpenStart(
  nameOrCtor: NameOrCtorDef, key?: Key, statics?: Statics) {
  const argsBuilder = getArgsBuilder();

  if (DEBUG) {
    assertNotInAttributes('elementOpenStart');
    setInAttributes(true);
  }

  argsBuilder[0] = nameOrCtor;
  argsBuilder[1] = key;
  argsBuilder[2] = statics;
}


/**
 * Allows you to define a key after an elementOpenStart. This is useful in
 * templates that define key after an element has been opened ie
 * `<div key('foo')></div>`.
 */
function key(key:string) {
  const argsBuilder = getArgsBuilder();

  if (DEBUG) {
    assertInAttributes('key');
    assert(argsBuilder);
  }
  argsBuilder[1] = key;
}


/***
 * Defines a virtual attribute at this point of the DOM. This is only valid
 * when called between elementOpenStart and elementOpenEnd.
 */
// tslint:disable-next-line:no-any
function attr(name: string, value: any) {
  const argsBuilder = getArgsBuilder();

  if (DEBUG) {
    assertInAttributes('attr');
  }

  argsBuilder.push(name);
  argsBuilder.push(value);
}


/**
 * Closes an open tag started with elementOpenStart.
 * @return The corresponding Element.
 */
function elementOpenEnd(): HTMLElement {
  const argsBuilder = getArgsBuilder();

  if (DEBUG) {
    assertInAttributes('elementOpenEnd');
    setInAttributes(false);
  }

  assert(argsBuilder);
  const node = elementOpen.apply(null, argsBuilder as any);
  truncateArray(argsBuilder, 0);
  return node;
}


/**
 * Closes an open virtual Element.
 *
 * @param nameOrCtor The Element's tag or constructor.
 * @return The corresponding Element.
 */
function elementClose(nameOrCtor: NameOrCtorDef): Element {
  if (DEBUG) {
    assertNotInAttributes('elementClose');
  }

  const node = close();

  if (DEBUG) {
    assertCloseMatchesOpenTag(getData(node).nameOrCtor, nameOrCtor);
  }

  return node;
}


/**
 * Declares a virtual Element at the current location in the document that has
 * no children.
 * @param nameOrCtor The Element's tag or constructor.
 * @param key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param statics An array of attribute name/value pairs of the static
 *     attributes for the Element. Attributes will only be set once when the
 *     Element is created.
 * @param varArgs Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return The corresponding Element.
 */
function elementVoid(
    nameOrCtor: NameOrCtorDef, key?: Key,
    // Ideally we could tag statics and varArgs as an array where every odd
    // element is a string and every even element is any, but this is hard.
    // tslint:disable-next-line:no-any
    statics?: Statics, ...varArgs: any[]) {
  elementOpen.apply(null, arguments as any);
  return elementClose(nameOrCtor);
}

/**
 * Declares a virtual Text at this point in the document.
 *
 * @param value The value of the Text.
 * @param varArgs
 *     Functions to format the value which are called only when the value has
 *     changed.
 * @return The corresponding text node.
 */
function text(value: string|number|boolean, ...varArgs: Array<(a: {}) => string>) {
  if (DEBUG) {
    assertNotInAttributes('text');
    assertNotInSkip('text');
  }

  const node = coreText();
  const data = getData(node);

  if (data.text !== value) {
    data.text = (value) as string;

    let formatted = value;
    for (let i = 1; i < arguments.length; i += 1) {
      /*
       * Call the formatter function directly to prevent leaking arguments.
       * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
       */
      const fn = arguments[i];
      formatted = fn(formatted);
    }

    // Setting node.data resets the cursor in IE/Edge.
    if (node.data !== formatted) {
      node.data = formatted as string;
    }
  }

  return node;
}


/** */
export {
  elementOpenStart,
  elementOpenEnd,
  elementOpen,
  elementVoid,
  elementClose,
  text,
  attr,
  key,
};
