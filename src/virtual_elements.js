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

import { NameOrCtorDef } from './types.js';
import {
  open,
  close,
  text as coreText
} from './core.js';
import { updateAttribute } from './attributes.js';
import { getData } from './node_data.js';
import {
  assertNotInAttributes,
  assertNotInSkip,
  assertInAttributes,
  assertCloseMatchesOpenTag,
  setInAttributes
} from './assertions.js';
import {
  createMap,
  truncateArray
} from './util.js';
import { globalObj } from './global.js';


/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 * @const
 */
const ATTRIBUTES_OFFSET = 3;


/**
 * Builds an array of arguments for use with elementOpenStart, attr and
 * elementOpenEnd.
 * @const {!Array<*>}
 */
const argsBuilder = [];


/**
 * Used to keep track of the previous values when a 2-way diff is necessary.
 * This object is reused.
 * @const {Object<*>}
 */
const prevAttrsMap = createMap();


/**
 * @param {NameOrCtorDef} nameOrCtor The Element's tag or constructor.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args, Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
const elementOpen = function(nameOrCtor, key, statics, var_args) {
  if (globalObj.DEBUG) {
    assertNotInAttributes('elementOpen');
    assertNotInSkip('elementOpen');
  }

  const node = open(nameOrCtor, key);
  const data = getData(node);

  if (!data.staticsApplied) {
    if (statics) {
      for (let i = 0; i < statics.length; i += 2) {
        const name = /** @type {string} */(statics[i]);
        const value = statics[i + 1];
        updateAttribute(node, name, value);
      }
    }
    // Down the road, we may want to keep track of the statics array to use it
    // as an additional signal about whether a node matches or not. For now,
    // just use a marker so that we do not reapply statics.
    data.staticsApplied = true;
  }

  /*
   * Checks to see if one or more attributes have changed for a given Element.
   * When no attributes have changed, this is much faster than checking each
   * individual argument. When attributes have changed, the overhead of this is
   * minimal.
   */
  const attrsArr = data.attrsArr;
  const isNew = !attrsArr.length;
  let i = ATTRIBUTES_OFFSET;
  let j = 0;

  for (; i < arguments.length; i += 2, j += 2) {
    const name = arguments[i];
    if (isNew) {
      attrsArr[j] = name;
    } else if (attrsArr[j] !== name) {
      break;
    }

    const value = arguments[i + 1];
    if (isNew || attrsArr[j + 1] !== value) {
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
};


/**
 * Declares a virtual Element at the current location in the document. This
 * corresponds to an opening tag and a elementClose tag is required. This is
 * like elementOpen, but the attributes are defined using the attr function
 * rather than being passed as arguments. Must be folllowed by 0 or more calls
 * to attr, then a call to elementOpenEnd.
 * @param {NameOrCtorDef} nameOrCtor The Element's tag or constructor.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 */
const elementOpenStart = function(nameOrCtor, key, statics) {
  if (globalObj.DEBUG) {
    assertNotInAttributes('elementOpenStart');
    setInAttributes(true);
  }

  argsBuilder[0] = nameOrCtor;
  argsBuilder[1] = key;
  argsBuilder[2] = statics;
};


/***
 * Defines a virtual attribute at this point of the DOM. This is only valid
 * when called between elementOpenStart and elementOpenEnd.
 *
 * @param {string} name
 * @param {*} value
 */
const attr = function(name, value) {
  if (globalObj.DEBUG) {
    assertInAttributes('attr');
  }

  argsBuilder.push(name);
  argsBuilder.push(value);
};


/**
 * Closes an open tag started with elementOpenStart.
 * @return {!Element} The corresponding Element.
 */
const elementOpenEnd = function() {
  if (globalObj.DEBUG) {
    assertInAttributes('elementOpenEnd');
    setInAttributes(false);
  }

  const node = elementOpen.apply(null, argsBuilder);
  truncateArray(argsBuilder, 0);
  return node;
};


/**
 * Closes an open virtual Element.
 *
 * @param {NameOrCtorDef} nameOrCtor The Element's tag or constructor.
 * @return {!Element} The corresponding Element.
 */
const elementClose = function(nameOrCtor) {
  if (globalObj.DEBUG) {
    assertNotInAttributes('elementClose');
  }

  const node = close();

  if (globalObj.DEBUG) {
    assertCloseMatchesOpenTag(getData(node).nameOrCtor, nameOrCtor);
  }

  return node;
};


/**
 * Declares a virtual Element at the current location in the document that has
 * no children.
 * @param {NameOrCtorDef} nameOrCtor The Element's tag or constructor.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
const elementVoid = function(nameOrCtor, key, statics, var_args) {
  elementOpen.apply(null, arguments);
  return elementClose(nameOrCtor);
};


/**
 * Declares a virtual Text at this point in the document.
 *
 * @param {string|number|boolean} value The value of the Text.
 * @param {...(function((string|number|boolean)):string)} var_args
 *     Functions to format the value which are called only when the value has
 *     changed.
 * @return {!Text} The corresponding text node.
 */
const text = function(value, var_args) {
  if (globalObj.DEBUG) {
    assertNotInAttributes('text');
    assertNotInSkip('text');
  }

  const node = coreText();
  const data = getData(node);

  if (data.text !== value) {
    data.text = /** @type {string} */(value);

    let formatted = value;
    for (let i = 1; i < arguments.length; i += 1) {
      /*
       * Call the formatter function directly to prevent leaking arguments.
       * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
       */
      const fn = arguments[i];
      formatted = fn(formatted);
    }

    node.data = formatted;
  }

  return node;
};


/** */
export {
  elementOpenStart,
  elementOpenEnd,
  elementOpen,
  elementVoid,
  elementClose,
  text,
  attr
};
