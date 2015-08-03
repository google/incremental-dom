/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
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

import {
    patch,
    text
} from '../../index';


describe('formatters', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('for newly created Text nodes', () => {
    function sliceOne(str) {
      return str.slice(1);
    }
  
    function prefixQuote(str) {
      return '\'' + str;
    }

    it('should render with the specified formatted value', () => {
      patch(container, () => {
        text('hello world!', sliceOne, prefixQuote);
      });
      var node = container.childNodes[0];

      expect(node.textContent).to.equal('\'ello world!');
    });
  });

  describe('for updated Text nodes', () => {
    var stub;

    function render(value) {
      text(value, stub);
    }

    beforeEach(() => {
      stub = sinon.stub();
      stub.onFirstCall().returns('stubValueOne');
      stub.onSecondCall().returns('stubValueTwo');
    });

    it('should not call the formatter for unchanged values', () => {
      patch(container, () => render('hello'));
      patch(container, () => render('hello'));
      var node = container.childNodes[0];

      expect(node.textContent).to.equal('stubValueOne');
      expect(stub).to.have.been.calledOnce;
    });

    it('should call the formatter when the value changes', () => {
      patch(container, () => render('hello'));
      patch(container, () => render('world'));
      var node = container.childNodes[0];

      expect(node.textContent).to.equal('stubValueTwo');
      expect(stub).to.have.been.calledTwice;
    });
  });
});

