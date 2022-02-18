/** @license SPDX-License-Identifier: Apache-2.0 */
import { Key, NameOrCtorDef } from "./types";
/**
 * Creates an Element and initializes the NodeData.
 * @param doc The document with which to create the Element.
 * @param parent The parent of new Element.
 * @param nameOrCtor The tag or constructor for the Element.
 * @param key A key to identify the Element.
 * @returns The newly created Element.
 */
declare function createElement(doc: Document, parent: Node | null, nameOrCtor: NameOrCtorDef, key: Key): Element;
/**
 * Creates a Text Node.
 * @param doc The document with which to create the Element.
 * @returns The newly created Text.
 */
declare function createText(doc: Document): Text;
export { createElement, createText };
