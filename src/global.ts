//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

/**
 * The name of the HTML attribute that holds the element key
 * (e.g. `<div key="foo">`). The attribute value, if it exists, is then used
 * as the default key when importing an element.
 * If null, no attribute value is used as the default key.
 */
let keyAttributeName: string | null = "key";

function getKeyAttributeName() {
  return keyAttributeName;
}

function setKeyAttributeName(name: string | null) {
  keyAttributeName = name;
}

export { DEBUG } from "./debug";
export { getKeyAttributeName, setKeyAttributeName };
