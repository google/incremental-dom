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

var IncrementalDOM = require('../../index'),
    patch = IncrementalDOM.patch,
    elementOpen = IncrementalDOM.elementOpen,
    elementClose = IncrementalDOM.elementClose,
    elementVoid = IncrementalDOM.elementVoid,
    elementPlaceholder = IncrementalDOM.elementPlaceholder;

describe('placeholders', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('without an existing DOM element', () => {
    var el;

    beforeEach(() => {
      patch(container, () => {
        el = elementPlaceholder('div', 'placeholder', ['class', 'someClass'], 'data-foo', 'bar');
      });
    });

    it('should render with the specified tag', () => {
      expect(el.tagName).to.equal('DIV');
    });

    it('should render with static attributes', () => {
      expect(el.className).to.equal('someClass');
    });

    it('should render with dynamic attributes', () => {
      expect(el.getAttribute('data-foo')).to.equal('bar');
    });
  });

  describe('with an existing DOM element', () => {
    var div;
    var el;
    var child;

    beforeEach(() => {
      patch(container, function() {
        div = elementPlaceholder('div', 'placeholder');
        patch(div, function() {
          child = elementVoid('div', null, ['id', 'child']);
        });
      });

      patch(container, () => {
        el = elementPlaceholder('span', 'placeholder', ['class', 'someClass'], 'data-foo', 'bar');
      });
    });

    it('should keep the element', () => {
      expect(el).to.equal(div);
      expect(div.tagName).to.equal('DIV');
    });

    it('should not set static attributes', () => {
      expect(div.getAttribute('class')).to.equal(null);
    });

    it('should set dynamic attributes', () => {
      expect(div.getAttribute('data-foo')).to.equal('bar');
    });

    it('should leave any decedents unaltered', () => {
      expect(child.parentNode).to.equal(div);
    });
  });
});

