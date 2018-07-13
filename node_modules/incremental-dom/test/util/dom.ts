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
