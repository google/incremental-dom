//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import * as Sinon from 'sinon';

import {patch, text} from '../../index';
const {expect} = chai;

describe('formatters', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('for newly created Text nodes', () => {
    function sliceOne(str: {}): string {
      return ('' + str).slice(1);
    }

    function prefixQuote(str: {}): string {
      return '\'' + str;
    }

    it('should render with the specified formatted value', () => {
      patch(container, () => {
        text('hello world!', sliceOne, prefixQuote);
      });
      const node = container.childNodes[0];

      expect(node.textContent).to.equal('\'ello world!');
    });
  });

  describe('for updated Text nodes', () => {
    let stub: Sinon.SinonStub;

    function render(value: string) {
      text(value, stub);
    }

    beforeEach(() => {
      stub = Sinon.stub();
      stub.onFirstCall().returns('stubValueOne');
      stub.onSecondCall().returns('stubValueTwo');
    });

    it('should not call the formatter for unchanged values', () => {
      patch(container, () => render('hello'));
      patch(container, () => render('hello'));
      const node = container.childNodes[0];

      expect(node.textContent).to.equal('stubValueOne');
      expect(stub).to.have.been.calledOnce;
    });

    it('should call the formatter when the value changes', () => {
      patch(container, () => render('hello'));
      patch(container, () => render('world'));
      const node = container.childNodes[0];

      expect(node.textContent).to.equal('stubValueTwo');
      expect(stub).to.have.been.calledTwice;
    });

    it('should call the formatter even if the initial value matches', () => {
      container.textContent = 'test';

      patch(container, () => {
        text('test', s => s + 'Z');
      });

      expect(container.textContent).to.equal('testZ');
    });
  });

  it('should not leak the arguments object', () => {
    const stub = Sinon.stub().returns('value');
    patch(container, () => text('value', stub));

    expect(stub).to.not.have.been.calledOn(['value', stub]);
  });
});
