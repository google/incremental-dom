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

// taze: mocha from //third_party/javascript/typings/mocha
// taze: chai from //third_party/javascript/typings/chai
import {elementOpenStart, patch, text} from '../../index';
const {expect} = chai;


describe('text nodes', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('when created', () => {
    it('should render a text node with the specified value', () => {
      patch(container, () => {
        text('Hello world!');
      });
      const node = container.childNodes[0];

      expect(node.textContent).to.equal('Hello world!');
      expect(node).to.be.instanceof(Text);
    });

    it('should allow for multiple text nodes under one parent element', () => {
      patch(container, () => {
        text('Hello ');
        text('World');
        text('!');
      });

      expect(container.textContent).to.equal('Hello World!');
    });

    it('should throw when inside virtual attributes element', () => {
      expect(() => {
        patch(container, () => {
          elementOpenStart('div');
          text('Hello');
        });
      })
          .to.throw(
              'text() can not be called between elementOpenStart()' +
              ' and elementOpenEnd().');
    });
  });

  describe('when updated after the DOM is updated', () => {
    // This avoids an Edge bug; see
    // https://github.com/google/incremental-dom/pull/398#issuecomment-497339108
    it('should do nothng', () => {
      patch(container, () => text('Hello'));

      container.firstChild!.nodeValue = 'Hello World!';

      const mo = new MutationObserver(() => {});
      mo.observe(container, {subtree: true, characterData: true});

      patch(container, () => text('Hello World!'));
      expect(mo.takeRecords()).to.be.empty;
      expect(container.textContent).to.equal('Hello World!');
    });
  });

  describe('with conditional text', () => {
    function render(data) {
      text(data);
    }

    it('should update the DOM when the text is updated', () => {
      patch(container, () => render('Hello'));
      patch(container, () => render('Hello World!'));
      const node = container.childNodes[0];

      expect(node.textContent).to.equal('Hello World!');
    });
  });
});
