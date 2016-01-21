/**
 * Copyright 2016 The Incremental DOM Authors. All Rights Reserved.
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
    patchOuter,
    elementOpen,
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

  it('should update attributes', () => {
    function render() {
      elementVoid('div', null, null,
          'tabindex', '0');
    }
  
    patchOuter(container, render);

    expect(container.getAttribute('tabindex')).to.equal('0');
  });

  it('should update children', () => {
    function render() {
      elementOpen('div');
        elementVoid('span');
      elementClose('div');
    }
  
    patchOuter(container, render);

    expect(container.firstChild.tagName).to.equal('SPAN');
  });

  it('should be re-entrant', function() {
    var containerOne = document.createElement('div');
    var containerTwo = document.createElement('div');

    function renderOne() {
      elementOpen('div');
        patchOuter(containerTwo, renderTwo);
        text('hello');
      elementClose('div');
    }

    function renderTwo() {
      elementOpen('div');
        text('foobar');
      elementClose('div');
    }

    patchOuter(containerOne, renderOne);

    expect(containerOne.textContent).to.equal('hello');
    expect(containerTwo.textContent).to.equal('foobar');
  });

  it('should pass third argument to render function', () => {
    function render(content) {
      elementOpen('div');
        text(content);
      elementClose('div');
    }

    patchOuter(container, render, 'foobar');

    expect(container.textContent).to.equal('foobar');
  });

  it('should throw an error on an empty patch', () => {
    function render() {}
  
    expect(() => patchOuter(container, render)).to.throw('There must be ' +
        'exactly one top level call corresponding to the patched element.');
  });

  it('should throw an error when patching the wrong tag', () => {
    function render() {
      elementVoid('span');
    }
  
    expect(() => patchOuter(container, render)).to.throw('There must be ' +
        'exactly one top level call corresponding to the patched element.');
  });

  it('should throw an error when patching too many elements', () => {
    function render() {
      elementVoid('div');
      elementVoid('div');
    }
  
    expect(() => patchOuter(container, render)).to.throw('There must be ' +
        'exactly one top level call corresponding to the patched element.');
  });
});
