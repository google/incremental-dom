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

import {patch, elementOpen, elementClose, elementVoid, text} from '../../index';

describe('patching an element', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('with an existing document tree', () => {
    let div;

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
      let child = container.childNodes[0];

      expect(child).to.equal(div);
    });

    it('should update attributes', () => {
      patch(container, render);
      let child = container.childNodes[0];

      expect(child.getAttribute('tabindex')).to.equal('0');
    });
  });

  it('should be re-entrant', function() {
    let containerOne = document.createElement('div');
    let containerTwo = document.createElement('div');

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
});

describe('patching a documentFragment', function() {
  it('should create the required DOM nodes', function() {
    let frag = document.createDocumentFragment();

    patch(frag, function() {
      elementOpen('div', null, null,
          'id', 'aDiv');
      elementClose('div');
    });

    expect(frag.children[0].id).to.equal('aDiv');
  });
});
