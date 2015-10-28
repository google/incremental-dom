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
  elementVoid,
  elementPlaceholder,
  text,
  symbols
} from '../../index';


describe('placeholders', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('created with the placeholder attribute', () => {
    function render(data) {
      elementVoid('div', data.key, [symbols.placeholder, true]);
    }

    it('should not add an attribute', () => {
      patch(container, render, { key: 'key' });
      var el = container.firstChild;

      expect(el.attributes.length).to.equal(0);
    });

    it('should not remove children on update', () => {
      var child = document.createElement('div');

      patch(container, render, { key: 'key' });
      var el = container.firstChild;
      el.appendChild(child);
      patch(container, render, { key: 'key' });

      expect(el.firstChild).to.equal(child);
    });

    it('should clean up children in a patch', () => {
      function innerRender(condition) {
        if (condition) {
          elementVoid('span');
        } else {
          elementVoid('p');
        }
      }

      patch(container, render, { key: 'key' });
      var el = container.firstChild;
      patch(el, innerRender, true);
      patch(el, innerRender, false);

      expect(el.innerHTML).to.equal('<p></p>');
    });
  });

  describe('created with elementPlaceholder', () => {
    function render(data) {
      elementPlaceholder('div', data.key, ['staticName', 'staticValue'],
          'dynamicName', data.val);
    }

    it('should warn about a missing key', () => {
      var fn = () => patch(container, render, {});
      expect(fn).to.throw('Placeholder elements must have a key specified.');
    });

    it('should render with specified static attributes', () => {
      patch(container, render, { key: 'key' });
      var el = container.firstChild;

      expect(el.getAttribute('staticName')).to.equal('staticValue');
    });

    it('should render with specified dynamic attributes', () => {
      patch(container, render, {
        key: 'key',
        val: 'dynamicValue'
      });
      var el = container.firstChild;

      expect(el.getAttribute('dynamicName')).to.equal('dynamicValue');
    });

    it('should reuse the same node', () => {
      patch(container, render, { key: 'key' });
      var el = container.firstChild;
      patch(container, render, { key: 'key' });

      expect(container.firstChild).to.equal(el);
    });

    it('should not remove children on update', () => {
      var child = document.createElement('div');

      patch(container, render, { key: 'key' });
      var el = container.firstChild;
      el.appendChild(child);
      patch(container, render, { key: 'key' });

      expect(el.firstChild).to.equal(child);
    });

    it('should clean up children in a patch', () => {
      function innerRender(condition) {
        if (condition) {
          elementVoid('span');
        } else {
          elementVoid('p');
        }
      }

      patch(container, render, { key: 'key' });
      var el = container.firstChild;
      patch(el, innerRender, true);
      patch(el, innerRender, false);

      expect(el.innerHTML).to.equal('<p></p>');
    });
  });
});

