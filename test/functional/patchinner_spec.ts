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

 // taze: chai from //third_party/javascript/typings/chai

import {
  patch,
  patchInner,
  elementOpen,
  elementOpenStart,
  elementOpenEnd,
  elementClose,
  elementVoid,
  text
} from '../../index';
import {
  assertHTMLElement,
} from '../util/dom';
import * as sinon from 'sinon';
const {expect} = chai;


describe('patching an element\'s children', () => {
  let container:HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('with an existing document tree', () => {
    let div:HTMLElement;

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
      patchInner(container, render);
      const child = container.childNodes[0];

      expect(child).to.equal(div);
    });

    describe('should return DOM node', () => {
      let node:HTMLElement;

      it('from elementOpen', () => {
        patchInner(container, () => {
          node = elementOpen('div');
          elementClose('div');
        });

        expect(node).to.equal(div);
      });

      it('from elementClose', () => {
        patchInner(container, () => {
          elementOpen('div');
          node = assertHTMLElement(elementClose('div'));
        });

        expect(node).to.equal(div);
      });

      it('from elementVoid', () => {
        patchInner(container, () => {
          node = assertHTMLElement(elementVoid('div'));
        });

        expect(node).to.equal(div);
      });

      it('from elementOpenEnd', () => {
        patchInner(container, () => {
          elementOpenStart('div');
          node = elementOpenEnd();
          elementClose('div');
        });

        expect(node).to.equal(div);
      });
    });
  });

  it('should be re-entrant', function() {
    const containerOne = document.createElement('div');
    const containerTwo = document.createElement('div');

    function renderOne() {
      elementOpen('div');
        patchInner(containerTwo, renderTwo);
        text('hello');
      elementClose('div');
    }

    function renderTwo() {
      text('foobar');
    }

    patchInner(containerOne, renderOne);

    expect(containerOne.textContent).to.equal('hello');
    expect(containerTwo.textContent).to.equal('foobar');
  });

  it('should pass third argument to render function', () => {

    function render(content:unknown) {
      text(content as string);
    }

    patchInner(container, render, 'foobar');

    expect(container.textContent).to.equal('foobar');
  });

  it('should patch a detached node', () => {
    const container = document.createElement('div');
    function render() {
      elementVoid('span');
    }

    patchInner(container, render);

    expect(assertHTMLElement(container.firstChild).tagName).to.equal('SPAN');
  });

  it('should throw when an element is unclosed', function() {
    expect(() => {
      patch(container, () => {
        elementOpen('div');
      });
    }).to.throw('One or more tags were not closed:\ndiv');
  });
});

describe('patching a documentFragment', function() {
  it('should create the required DOM nodes', function() {
    const frag = document.createDocumentFragment();

    patchInner(frag, function() {
      elementOpen('div', null, null,
          'id', 'aDiv');
      elementClose('div');
    });

    expect(assertHTMLElement(frag.childNodes[0]).id).to.equal('aDiv');
  });
});

describe('patch', () => {
  it('should alias patchInner', () => {
    expect(patch).to.equal(patchInner);
  });
});
