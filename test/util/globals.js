//  Copyright 2017 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

// This is in a separate file as a global to prevent Babel from transpiling
// classes. Transpiled classes do not work with customElements.define.
if (window.customElements) {
  window.MyElementDefine = class extends HTMLElement {
    constructor() {
      super();
    }
  };

  window.customElements.define('my-element-define', window.MyElementDefine);
}

if (document.registerElement) {
  window.MyElementRegister = document.registerElement('my-element-register', {
    prototype: Object.create(HTMLElement.prototype)
  });
}