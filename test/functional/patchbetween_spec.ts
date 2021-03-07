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
  patchBetween,
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
const {expect} = chai;


describe('patching between', () => {
  let container:HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.setAttribute('tid', 'container');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should create the required DOM nodes between comments', () => {
    const startNode = document.createComment('start');
    const endNode = document.createComment('end');
    container.append(startNode, endNode);

    patchBetween(startNode, endNode, () => {
      elementOpen('div', null, null, 'id', 'aDiv');
      elementClose('div');
      elementOpen('div', null, null, 'id', 'bDiv');
      elementClose('div');
    });

    expect(container.innerHTML).to.eq('<!--start--><div id="aDiv"></div><div id="bDiv"></div><!--end-->');
    expect(assertHTMLElement(container.childNodes[1]).id).to.equal('aDiv');
    expect(assertHTMLElement(container.childNodes[2]).id).to.equal('bDiv');
  });

  it('should create the required DOM nodes between divs', () => {
    const startNode = document.createElement('div');
    // startNode.setAttribute('tid', 'start');
    const endNode = document.createElement('div');
    // endNode.setAttribute('tid', 'end');
    container.append(startNode, endNode);

    patchBetween(startNode, endNode, () => {
      elementOpen('div', null, null, 'id', 'aDiv');
      elementClose('div');
      elementOpen('div', null, null, 'id', 'bDiv');
      elementClose('div');
    });

    expect(container.innerHTML).to.eq('<div></div><div id="aDiv"></div><div id="bDiv"></div><div></div>');
    expect(assertHTMLElement(container.childNodes[1]).id).to.equal('aDiv');
    expect(assertHTMLElement(container.childNodes[2]).id).to.equal('bDiv');
  });

  describe('with an existing document tree', () => {
    // TODO: add test w/ keyed items after the endNode

    let div:HTMLElement;
    let startNode;
    let endNode;

    function render() {
      elementVoid('div', null, null, 'tabindex', '0');
    }

    beforeEach(function() {
      div = document.createElement('div');
      div.setAttribute('tabindex', '-1');
      startNode = document.createComment('start');
      endNode = document.createComment('end');
      container.append(startNode, div, endNode);
    });

    it('should preserve existing nodes', () => {
      patchBetween(startNode, endNode, render);
      const child = container.childNodes[1];
      expect(child).to.equal(div);
    });

    describe('should return DOM node', () => {
      let node:HTMLElement;

      it('from elementOpen', () => {
        patchBetween(startNode, endNode, () => {
          node = elementOpen('div');
          elementClose('div');
        });

        expect(node).to.equal(div);
      });

      it('from elementClose', () => {
        patchBetween(startNode, endNode, () => {
          elementOpen('div');
          node = assertHTMLElement(elementClose('div'));
        });

        expect(node).to.equal(div);
      });

      it('from elementVoid', () => {
        patchBetween(startNode, endNode, () => {
          node = assertHTMLElement(elementVoid('div'));
        });

        expect(node).to.equal(div);
      });

      it('from elementOpenEnd', () => {
        patchBetween(startNode, endNode, () => {
          elementOpenStart('div');
          node = elementOpenEnd();
          elementClose('div');
        });

        expect(node).to.equal(div);
      });
    });
  });

  it('should be re-entrant', () => {
    const startNode = document.createElement('div');
    // startNode.setAttribute('tid', 'start');
    const endNode = document.createElement('div');
    // endNode.setAttribute('tid', 'end');
    container.append(startNode, endNode);

    patchBetween(startNode, endNode, () => {
      const div1 = elementOpen('div', null, null, 'id', 'aDiv');
      elementClose('div');
      const div2 = elementOpen('div', null, null, 'id', 'bDiv');
      elementClose('div');
      patchBetween(div1, div2, () => {
        elementOpen('div', null, null, 'id', 'cDiv');
        elementClose('div');
      });
      elementOpen('div', null, null, 'id', 'dDiv');
      elementClose('div');
    });

    expect(container.innerHTML).to.eq(
      '<div></div><div id="aDiv"></div><div id="cDiv"></div><div id="bDiv"></div><div id="dDiv"></div><div></div>');
    expect(assertHTMLElement(container.childNodes[1]).id).to.equal('aDiv');
    expect(assertHTMLElement(container.childNodes[2]).id).to.equal('cDiv');
  });

  it('should pass third argument to render function', () => {
    const startNode = document.createElement('div');
    const endNode = document.createElement('div');
    container.append(startNode, endNode);

    const render = (content:unknown) => {
      text(content as string);
    };

    patchBetween(startNode, endNode, render, 'foobar');

    expect(container.textContent).to.equal('foobar');
  });

  it('should patch a detached node', () => {
    const container = document.createElement('div');
    const startNode = document.createElement('div');
    const endNode = document.createElement('div');
    container.append(startNode, endNode);

    const render = () => {
      elementVoid('span');
    };

    patchBetween(startNode, endNode, render);

    expect(assertHTMLElement(container.childNodes[1]).tagName).to.equal('SPAN');
  });

  it('should throw when an element is unclosed', () => {
    const startNode = document.createComment('start');
    const endNode = document.createComment('end');
    container.append(startNode, endNode);

    expect(() => {
      patchBetween(startNode, endNode, () => {
        elementOpen('div');
      });
    }).to.throw('One or more tags were not closed:\ndiv');
  });

});

describe('patching a documentFragment', () => {
  it('should create the required DOM nodes', () => {
    const frag = document.createDocumentFragment();
    const startNode = document.createComment('start');
    const endNode = document.createComment('end');
    frag.append(startNode, endNode);

    patchBetween(startNode, endNode, () => {
      elementOpen('div', null, null, 'id', 'aDiv');
      elementClose('div');
    });

    expect(assertHTMLElement(frag.childNodes[1]).id).to.equal('aDiv');
  });
});
