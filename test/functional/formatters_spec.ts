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
