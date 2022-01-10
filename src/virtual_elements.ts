//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import {
  assert,
  assertCloseMatchesOpenTag,
  assertInAttributes,
  assertInPatch,
  assertNotInAttributes,
  assertNotInSkip,
  setInAttributes
} from "./assertions";
import { attributes, updateAttribute } from "./attributes";
import {
  getArgsBuilder,
  getAttrsBuilder,
  close,
  open,
  text as coreText,
  currentElement
} from "./core";
import { DEBUG } from "./global";
import { getData, NodeData } from "./node_data";
import { AttrMutatorConfig, Key, NameOrCtorDef, Statics } from "./types";
import { createMap, truncateArray } from "./util";
import { calculateDiff } from "./diff";

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
 * @param element The Element to diff the attrs for.
 * @param data The NodeData associated with the Element.
 * @param attrs The attribute map of mutators
 */
function diffAttrs(element: Element, data: NodeData, attrs: AttrMutatorConfig) {
  const attrsBuilder = getAttrsBuilder();
  const prevAttrsArr = data.getAttrsArr(attrsBuilder.length);

  calculateDiff(
    prevAttrsArr,
    attrsBuilder,
    element,
    updateAttribute,
    attrs,
    data.alwaysDiffAttributes
  );
  truncateArray(attrsBuilder, 0);
}

/**
 * Applies the statics. When importing an Element, any existing attributes that
 * match a static are converted into a static attribute.
 * @param node The Element to apply statics for.
 * @param data The NodeData associated with the Element.
 * @param statics The statics array.
 * @param attrs The attribute map of mutators.
 */
function diffStatics(
  node: Element,
  data: NodeData,
  statics: Statics,
  attrs: AttrMutatorConfig
) {
  if (data.staticsApplied) {
    return;
  }

  data.staticsApplied = true;

  if (!statics || !statics.length) {
    return;
  }

  if (data.hasEmptyAttrsArr()) {
    for (let i = 0; i < statics.length; i += 2) {
      updateAttribute(node, statics[i] as string, statics[i + 1], attrs);
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
    updateAttribute(node, name, statics[prevAttrsMap[name]], attrs);
    delete prevAttrsMap[name];
  }
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
  nameOrCtor: NameOrCtorDef,
  key?: Key,
  statics?: Statics
) {
  const argsBuilder = getArgsBuilder();

  if (DEBUG) {
    assertNotInAttributes("elementOpenStart");
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
 * @param key The key to use for the next call.
 */
function key(key: string) {
  const argsBuilder = getArgsBuilder();

  if (DEBUG) {
    assertInAttributes("key");
    assert(argsBuilder);
  }
  argsBuilder[1] = key;
}

/**
 * Buffers an attribute, which will get applied during the next call to
 * `elementOpen`, `elementOpenEnd` or `applyAttrs`.
 * @param name The of the attribute to buffer.
 * @param value The value of the attribute to buffer.
 */
function attr(name: string, value: any) {
  const attrsBuilder = getAttrsBuilder();

  if (DEBUG) {
    assertInPatch("attr");
  }

  attrsBuilder.push(name);
  attrsBuilder.push(value);
}

/** @return The value of the nonce attribute. */
function getNonce(): string {
  const argsBuilder = getArgsBuilder();
  const statics = <Statics>argsBuilder[2];
  if (statics) {
    for (let i = 0; i < statics.length; i += 2) {
      if (statics[i] === "nonce") {
        return statics[i + 1] as string;
      }
    }
  }
  return "";
}

/**
 * Closes an open tag started with elementOpenStart.
 * @return The corresponding Element.
 */
function elementOpenEnd(): HTMLElement {
  const argsBuilder = getArgsBuilder();

  if (DEBUG) {
    assertInAttributes("elementOpenEnd");
    setInAttributes(false);
  }

  const node = open(
    <NameOrCtorDef>argsBuilder[0],
    <Key>argsBuilder[1],
    getNonce()
  );
  const data = getData(node);

  diffStatics(node, data, <Statics>argsBuilder[2], attributes);
  diffAttrs(node, data, attributes);
  truncateArray(argsBuilder, 0);

  return node;
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
  nameOrCtor: NameOrCtorDef,
  key?: Key,
  // Ideally we could tag statics and varArgs as an array where every odd
  // element is a string and every even element is any, but this is hard.
  statics?: Statics,
  ...varArgs: Array<any>
) {
  if (DEBUG) {
    assertNotInAttributes("elementOpen");
    assertNotInSkip("elementOpen");
  }

  elementOpenStart(nameOrCtor, key, statics);

  for (let i = ATTRIBUTES_OFFSET; i < arguments.length; i += 2) {
    attr(arguments[i], arguments[i + 1]);
  }

  return elementOpenEnd();
}

/**
 * Applies the currently buffered attrs to the currently open element. This
 * clears the buffered attributes.
 * @param attrs The attributes.
 */
function applyAttrs(attrs = attributes) {
  const node = currentElement();
  const data = getData(node);

  diffAttrs(node, data, attrs);
}

/**
 * Applies the current static attributes to the currently open element. Note:
 * statics should be applied before calling `applyAtrs`.
 * @param statics The statics to apply to the current element.
 * @param attrs The attributes.
 */
function applyStatics(statics: Statics, attrs = attributes) {
  const node = currentElement();
  const data = getData(node);

  diffStatics(node, data, statics, attrs);
}

/**
 * Closes an open virtual Element.
 *
 * @param nameOrCtor The Element's tag or constructor.
 * @return The corresponding Element.
 */
function elementClose(nameOrCtor: NameOrCtorDef): Element {
  if (DEBUG) {
    assertNotInAttributes("elementClose");
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
  nameOrCtor: NameOrCtorDef,
  key?: Key,
  // Ideally we could tag statics and varArgs as an array where every odd
  // element is a string and every even element is any, but this is hard.
  statics?: Statics,
  ...varArgs: Array<any>
) {
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
function text(
  value: string | number | boolean,
  ...varArgs: Array<(a: {}) => string>
) {
  if (DEBUG) {
    assertNotInAttributes("text");
    assertNotInSkip("text");
  }

  const node = coreText();
  const data = getData(node);

  if (data.text !== value) {
    data.text = value as string;

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
  applyAttrs,
  applyStatics,
  elementOpenStart,
  elementOpenEnd,
  elementOpen,
  elementVoid,
  elementClose,
  text,
  attr,
  key
};
