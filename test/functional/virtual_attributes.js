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
  elementOpen,
  elementOpenStart,
  elementOpenEnd,
  elementClose,
  attr
} from '../../index.js';


describe('virtual attribute updates', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('for conditional attributes', () => {
    function render(obj) {
      elementOpenStart('div');
        if (obj.key) {
          attr('data-expanded', obj.key);
        }
      elementOpenEnd();
      elementClose('div');
    }

    it('should be present when specified', () => {
      patch(container, () => render({
        key: 'hello'
      }));
      const el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('hello');
    });

    it('should be not present when not specified', () => {
      patch(container, () => render({
        key: false
      }));
      const el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal(null);
    });

    it('should update the DOM when they change', () => {
      patch(container, () => render({
        key: 'foo'
      }));
      patch(container, () => render({
        key: 'bar'
      }));
      const el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('bar');
    });

    it('should throw when defined outside virtual attributes element', () => {
      expect(() => {
        patch(container, () => {
          attr('data-expanded', true);
        });
      }).to.throw('attr() can only be called after calling elementOpenStart().');
    });
  });

  it('should throw when a virtual attributes element is unclosed', () => {
    expect(() => {
      patch(container, () => {
        elementOpenStart('div');
      });
    }).to.throw('elementOpenEnd() must be called after calling elementOpenStart().');
  });

  it('should throw when virtual attributes element is closed without being opened', () => {
    expect(() => {
      patch(container, () => {
        elementOpenEnd();
      });
    }).to.throw('elementOpenEnd() can only be called after calling elementOpenStart().');
  });

  it('should throw when opening an element inside a virtual attributes element', () => {
    expect(() => {
      patch(container, () => {
        elementOpenStart('div');
        elementOpen('div');
      });
    }).to.throw('elementOpen() can not be called between elementOpenStart() and elementOpenEnd().');
  });

  it('should throw when opening a virtual attributes element inside a virtual attributes element', () => {
    expect(() => {
      patch(container, () => {
        elementOpenStart('div');
        elementOpenStart('div');
      });
    }).to.throw('elementOpenStart() can not be called between elementOpenStart() and elementOpenEnd().');
  });

  it('should throw when closing an element inside a virtual attributes element', () => {
    expect(() => {
      patch(container, () => {
        elementOpenStart('div');
        elementClose('div');
      });
    }).to.throw('elementClose() can not be called between elementOpenStart() and elementOpenEnd().');
  });
});

