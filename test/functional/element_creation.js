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
    ie_open = IncrementalDOM.ie_open,
    ie_close = IncrementalDOM.ie_close,
    ie_void = IncrementalDOM.ie_void;

describe('element creation', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('when creating a single node', () => {
    var el;

    beforeEach(() => {
      patch(container, () => {
        ie_void('div', '', ['id', 'someId', 'class', 'someClass', 'data-custom', 'custom'],
                'data-foo', 'Hello',
                'data-bar', 'World');
      });

      el = container.childNodes[0];
    });

    it('should render with the specified tag', () => {
      expect(el.tagName).to.equal('DIV');
    });

    it('should render with static attributes', () => {
      expect(el.id).to.equal('someId');
      expect(el.className).to.equal('someClass');
      expect(el.getAttribute('data-custom')).to.equal('custom');
    });

    it('should render with dynamic attributes', () => {
      expect(el.getAttribute('data-foo')).to.equal('Hello');
      expect(el.getAttribute('data-bar')).to.equal('World');
    });
  });

  it('should allow creation without static attributes', () => {
    patch(container, () => {
      ie_void('div', '', null,
              'id', 'test');
    });
    var el = container.childNodes[0];
    expect(el.id).to.equal('test');
  });
});

