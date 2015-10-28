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
  elementClose,
  elementVoid
} from '../../index';


describe('conditional rendering', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('nodes', () => {
    function render(condition) {
      elementOpen('div', 'outer', ['id', 'outer']);
        elementVoid('div', 'one', ['id', 'one']);

        if (condition) {
          elementVoid('div', 'conditional-one', ['id', 'conditional-one']);
          elementVoid('div', 'conditional-two', ['id', 'conditional-two']);
        }

        elementVoid('span', 'two', ['id', 'two' ]);
      elementClose('div');
    }

    it('should un-render when the condition becomes false', () => {
      patch(container, () => render(true));
      patch(container, () => render(false));
      var outer = container.childNodes[0];

      expect(outer.childNodes).to.have.length(2);
      expect(outer.childNodes[0].id).to.equal('one');
      expect(outer.childNodes[0].tagName).to.equal('DIV');
      expect(outer.childNodes[1].id).to.equal('two');
      expect(outer.childNodes[1].tagName).to.equal('SPAN');
    });

    it('should render when the condition becomes true', () => {
      patch(container, () => render(false));
      patch(container, () => render(true));
      var outer = container.childNodes[0];

      expect(outer.childNodes).to.have.length(4);
      expect(outer.childNodes[0].id).to.equal('one');
      expect(outer.childNodes[0].tagName).to.equal('DIV');
      expect(outer.childNodes[1].id).to.equal('conditional-one');
      expect(outer.childNodes[1].tagName).to.equal('DIV');
      expect(outer.childNodes[2].id).to.equal('conditional-two');
      expect(outer.childNodes[2].tagName).to.equal('DIV');
      expect(outer.childNodes[3].id).to.equal('two');
      expect(outer.childNodes[3].tagName).to.equal('SPAN');
    });
  });

  describe('with only conditional childNodes', () => {
    function render(condition) {
      elementOpen('div', 'outer', ['id', 'outer']);

        if (condition) {
          elementVoid('div', 'conditional-one', ['id', 'conditional-one' ]);
          elementVoid('div', 'conditional-two', ['id', 'conditional-two' ]);
        }

      elementClose('div');
    }

    it('should not leave any remaning nodes', () => {
      patch(container, () => render(true));
      patch(container, () => render(false));
      var outer = container.childNodes[0];

      expect(outer.childNodes).to.have.length(0);
    });
  });

  describe('nodes', () => {
    function render(condition) {
      elementOpen('div', null, null,
          'id', 'outer');
        elementVoid('div', null, null,
            'id', 'one' );

        if (condition) {
          elementOpen('span', null, null,
              'id', 'conditional-one',
              'data-foo', 'foo');
            elementVoid('span');
          elementClose('span');
        }

        elementVoid('span', null, null,
            'id', 'two');
      elementClose('div');
    }

    it('should strip children when a conflicting node is re-used', () => {
      patch(container, () => render(true));
      patch(container, () => render(false));
      var outer = container.childNodes[0];

      expect(outer.childNodes).to.have.length(2);
      expect(outer.childNodes[0].id).to.equal('one');
      expect(outer.childNodes[0].tagName).to.equal('DIV');
      expect(outer.childNodes[1].id).to.equal('two');
      expect(outer.childNodes[1].tagName).to.equal('SPAN');
      expect(outer.childNodes[1].children.length).to.equal(0);
    });

    it('should strip attributes when a conflicting node is re-used', () => {
      patch(container, () => render(true));
      patch(container, () => render(false));
      var outer = container.childNodes[0];

      expect(outer.childNodes[1].getAttribute('data-foo')).to.be.null;
    });
  });
});

