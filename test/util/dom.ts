//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

const BROWSER_SUPPORTS_SHADOW_DOM = 'ShadowRoot' in window;


const attachShadow = (el: HTMLElement) => {
  return el.attachShadow ? el.attachShadow({mode: 'closed'}) :
                           // tslint:disable:no-any
      (el as any).createShadowRoot();
};

function assertElement(el: Node|null): Element {
  if (el instanceof Element) {
    return el;
  }
  throw new Error('Expected element to be Element');
}

function assertHTMLElement(el: Node|null): HTMLElement {
  if (el instanceof HTMLElement) {
    return el;
  }
  throw new Error('Expected element to be HTMLElement');
}


export {
  BROWSER_SUPPORTS_SHADOW_DOM,
  assertElement,
  assertHTMLElement,
  attachShadow
};
