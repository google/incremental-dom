//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import { getData, initData } from "./node_data";
import { Key, NameOrCtorDef } from "./types";

/**
 * Gets the namespace to create an element (of a given tag) in.
 * @param tag The tag to get the namespace for.
 * @param parent The current parent Node, if any.
 * @returns The namespace to use.
 */
function getNamespaceForTag(tag: string, parent: Node | null) {
  if (tag === "svg") {
    return "http://www.w3.org/2000/svg";
  }

  if (tag === "math") {
    return "http://www.w3.org/1998/Math/MathML";
  }

  if (parent == null) {
    return null;
  }

  if (getData(parent).nameOrCtor === "foreignObject") {
    return null;
  }

  // Since TypeScript 4.4 namespaceURI is only defined for Attr and Element
  // nodes. Checking for Element nodes here seems reasonable but breaks SVG
  // rendering in Chrome in certain cases. The cast to any should be removed
  // once we know why this happens.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (parent as any).namespaceURI;
}

/**
 * Creates an Element and initializes the NodeData.
 * @param doc The document with which to create the Element.
 * @param parent The parent of new Element.
 * @param nameOrCtor The tag or constructor for the Element.
 * @param key A key to identify the Element.
 * @returns The newly created Element.
 */
function createElement(
  doc: Document,
  parent: Node | null,
  nameOrCtor: NameOrCtorDef,
  key: Key
): Element {
  let el;

  if (typeof nameOrCtor === "function") {
    el = new nameOrCtor();
  } else {
    const namespace = getNamespaceForTag(nameOrCtor, parent);

    if (namespace) {
      el = doc.createElementNS(namespace, nameOrCtor);
    } else {
      el = doc.createElement(nameOrCtor);
    }
  }

  initData(el, nameOrCtor, key);

  return el;
}

/**
 * Creates a Text Node.
 * @param doc The document with which to create the Element.
 * @returns The newly created Text.
 */
function createText(doc: Document): Text {
  const node = doc.createTextNode("");
  initData(node, "#text", null);
  return node;
}

export { createElement, createText };
