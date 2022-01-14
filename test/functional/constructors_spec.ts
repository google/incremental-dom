//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import * as Sinon from 'sinon';

import {close, open, patch} from '../../index';
import {assertHTMLElement,} from '../util/dom';
const {expect} = chai;

declare global {
  interface Window {
    // tslint:disable-next-line:no-any
    MyElementDefine: any;
    // tslint:disable-next-line:no-any
    MyElementRegister: any;
  }
}

describe('Element constructors', () => {
  const MyElementRegister = window.MyElementRegister;
  const MyElementDefine = window.MyElementDefine;
  let container: HTMLElement;
  const sandbox = Sinon.sandbox.create();

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    sandbox.restore();
    document.body.removeChild(container);
  });

  describe('element creation', () => {
    if (MyElementRegister) {
      it('should render when created with document.registerElement', () => {
        patch(container, () => {
          open(MyElementRegister);
          close();
        });

        const el = assertHTMLElement(container.firstChild);
        expect(el.localName).to.equal('my-element-register');
        expect(el.constructor).to.equal(MyElementRegister);
      });
    }

    if (MyElementDefine) {
      it('should render when created with customElements.define', () => {
        patch(container, () => {
          open(MyElementDefine);
          close();
        });

        const el = container.firstChild as HTMLElement;
        expect(el.localName).to.equal('my-element-define');
        expect(el.constructor).to.equal(MyElementDefine);
      });
    }
  });

  describe('updates', () => {
    if (MyElementRegister) {
      it('should re-use elements with the same constructor', () => {
        function render() {
          open(MyElementRegister);
          close();
        }

        patch(container, render);
        const el = container.firstChild;
        patch(container, render);

        expect(container.firstChild).to.equal(el);
      });
    }
  });
});

