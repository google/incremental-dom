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
    elementVoid,
    text
} from '../../index';


describe('patching an element', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('with an existing document tree', () => {
    var div;

    function render() {
      elementVoid('div', null, null,
          'tabindex', '0');
    }

    beforeEach(function() {
      div = document.createElement('div');
      div.setAttribute('tabindex', '-1');
      container.appendChild(div);
    });

    it('should preserve existing nodes', () => {
      patch(container, render);
      var child = container.childNodes[0];

      expect(child).to.equal(div);
    });

    it('should update attributes', () => {
      patch(container, render);
      var child = container.childNodes[0];

      expect(child.getAttribute('tabindex')).to.equal('0');
    });

    describe('should return DOM node', () => {
      var node;

      it('from elementOpen', () => {
        patch(container, () => {
          node = elementOpen('div');
          elementClose('div');
        });

        expect(node).to.equal(div);
      });

      it('from elementClose', () => {
        patch(container, () => {
          elementOpen('div');
          node = elementClose('div');
        });

        expect(node).to.equal(div);
      });

      it('from elementVoid', () => {
        patch(container, () => {
          node = elementVoid('div');
        });

        expect(node).to.equal(div);
      });

      it('from elementOpenEnd', () => {
        patch(container, () => {
          elementOpenStart('div');
          node = elementOpenEnd('div');
          elementClose('div');
        });

        expect(node).to.equal(div);
      });
    });
  });

  it('should be re-entrant', function() {
    var containerOne = document.createElement('div');
    var containerTwo = document.createElement('div');

    function renderOne() {
      elementOpen('div');
        patch(containerTwo, renderTwo);
        text('hello');
      elementClose('div');
    }

    function renderTwo() {
      text('foobar');
    }

    patch(containerOne, renderOne);

    expect(containerOne.textContent).to.equal('hello');
    expect(containerTwo.textContent).to.equal('foobar');
  });

  it('should pass third argument to render function', () => {
    function render(content) {
      text(content);
    }

    patch(container, render, 'foobar');

    expect(container.textContent).to.equal('foobar');
  });
});

describe('patching a documentFragment', function() {
  it('should create the required DOM nodes', function() {
    var frag = document.createDocumentFragment();

    patch(frag, function() {
      elementOpen('div', null, null,
          'id', 'aDiv');
      elementClose('div');
    });

    expect(frag.childNodes[0].id).to.equal('aDiv');
  });
});
