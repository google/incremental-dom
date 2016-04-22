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
  let container;

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

  it('should return the DOM node', () => {
    function render() {
      elementVoid('div');
    }

    const result = patchOuter(container, render);

    expect(result).to.equal(container);
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
    const containerOne = document.createElement('div');
    const containerTwo = document.createElement('div');

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

  it('should patch a detached node', () => {
    const container = document.createElement('div');
    function render() {
      elementOpen('div');
        elementVoid('span');
      elementClose('div');
    }

    patchOuter(container, render);

    expect(container.firstChild.tagName).to.equal('SPAN');
  });

  describe('with an empty patch', () => {
    let div;
    let result;

    beforeEach(() => {
      div = container.appendChild(document.createElement('div'));

      result = patchOuter(div, () => {});
    });

    it('should remove the DOM node on an empty patch', () => {
      expect(container.firstChild).to.be.null;
    });

    it('should remove the DOM node on an empty patch', () => {
      expect(result).to.be.null;
    });
  });

  describe('with a different tag', () => {
    let div;
    let span;
    let result;

    function render() {
      elementVoid('span');
    }

    beforeEach(() => {
      div = container.appendChild(document.createElement('div'));

      result = patchOuter(div, render);
      span = container.querySelector('span');
    });


    it('should replace the DOM node', () => {
      expect(container.children).to.have.length(1);
      expect(container.firstChild).to.equal(span);
    });

    it('should return the new DOM node', () => {
      expect(result).to.equal(span);
    });
  });

  it('should not hang on to removed elements with keys', () => {
    function render(present) {
      elementVoid('div', 'key');
    }

    const divOne = container.appendChild(document.createElement('div'));
    patchOuter(divOne, render);
    const el = container.firstChild;
    patchOuter(el, () => {});
    const divTwo = container.appendChild(document.createElement('div'));
    patchOuter(divTwo, render);

    expect(container.children).to.have.length(1);
    expect(container.firstChild).to.not.equal(el);
  });

  it('should throw an error when patching too many elements', () => {
    const div = container.appendChild(document.createElement('div'));
    function render() {
      elementVoid('div');
      elementVoid('div');
    }

    expect(() => patchOuter(div, render)).to.throw('There must be ' +
        'exactly one top level call corresponding to the patched element.');
  });
});
