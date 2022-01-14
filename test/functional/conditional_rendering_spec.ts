//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import {elementClose, elementOpen, elementVoid, patch} from '../../index';
import {assertHTMLElement,} from '../util/dom';
const {expect} = chai;


describe('conditional rendering', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('nodes', () => {
    function render(condition: boolean) {
      elementOpen('div', 'outer', ['id', 'outer']);
      elementVoid('div', 'one', ['id', 'one']);

      if (condition) {
        elementVoid('div', 'conditional-one', ['id', 'conditional-one']);
        elementVoid('div', 'conditional-two', ['id', 'conditional-two']);
      }

      elementVoid('span', 'two', ['id', 'two']);
      elementClose('div');
    }

    it('should un-render when the condition becomes false', () => {
      patch(container, () => render(true));
      patch(container, () => render(false));
      const outer = container.childNodes[0];

      expect(outer.childNodes).to.have.length(2);
      expect(assertHTMLElement(outer.childNodes[0]).id).to.equal('one');
      expect(assertHTMLElement(outer.childNodes[0]).tagName).to.equal('DIV');
      expect(assertHTMLElement(outer.childNodes[1]).id).to.equal('two');
      expect(assertHTMLElement(outer.childNodes[1]).tagName).to.equal('SPAN');
    });

    it('should not move non-keyed nodes', () => {
      function render(condition: boolean) {
        if (condition) {
          elementVoid('div');
        }

        elementVoid('span');
        elementVoid('div');
      }

      patch(container, () => render(false));
      const secondDiv = container.lastChild;
      patch(container, () => render(true));
      const firstChild = container.firstChild;
      const lastChild = container.lastChild;

      expect(container.childNodes).to.have.length(3);
      expect(firstChild).to.not.equal(secondDiv);
      expect(lastChild).to.equal(secondDiv);
    });


    it('should render when the condition becomes true', () => {
      patch(container, () => render(false));
      patch(container, () => render(true));
      const outer = container.childNodes[0];

      expect(outer.childNodes).to.have.length(4);
      expect(assertHTMLElement(outer.childNodes[0]).id).to.equal('one');
      expect(assertHTMLElement(outer.childNodes[0]).tagName).to.equal('DIV');
      expect(assertHTMLElement(outer.childNodes[1]).id)
          .to.equal('conditional-one');
      expect(assertHTMLElement(outer.childNodes[1]).tagName).to.equal('DIV');
      expect(assertHTMLElement(outer.childNodes[2]).id)
          .to.equal('conditional-two');
      expect(assertHTMLElement(outer.childNodes[2]).tagName).to.equal('DIV');
      expect(assertHTMLElement(outer.childNodes[3]).id).to.equal('two');
      expect(assertHTMLElement(outer.childNodes[3]).tagName).to.equal('SPAN');
    });
  });

  describe('with only conditional childNodes', () => {
    function render(condition: boolean) {
      elementOpen('div', 'outer', ['id', 'outer']);

      if (condition) {
        elementVoid('div', 'conditional-one', ['id', 'conditional-one']);
        elementVoid('div', 'conditional-two', ['id', 'conditional-two']);
      }

      elementClose('div');
    }

    it('should not leave any remaning nodes', () => {
      patch(container, () => render(true));
      patch(container, () => render(false));
      const outer = container.childNodes[0];

      expect(outer.childNodes).to.have.length(0);
    });
  });

  describe('nodes', () => {
    function render(condition: boolean) {
      elementOpen('div', null, null, 'id', 'outer');
      elementVoid('div', null, null, 'id', 'one');

      if (condition) {
        elementOpen(
            'span', null, null, 'id', 'conditional-one', 'data-foo', 'foo');
        elementVoid('span');
        elementClose('span');
      }

      elementVoid('span', null, null, 'id', 'two');
      elementClose('div');
    }

    it('should strip children when a conflicting node is re-used', () => {
      patch(container, () => render(true));
      patch(container, () => render(false));
      const outer = container.childNodes[0];

      expect(outer.childNodes).to.have.length(2);
      expect(assertHTMLElement(outer.childNodes[0]).id).to.equal('one');
      expect(assertHTMLElement(outer.childNodes[0]).tagName).to.equal('DIV');
      expect(assertHTMLElement(outer.childNodes[1]).id).to.equal('two');
      expect(assertHTMLElement(outer.childNodes[1]).tagName).to.equal('SPAN');
      expect(assertHTMLElement(outer.childNodes[1]).children.length)
          .to.equal(0);
    });

    it('should strip attributes when a conflicting node is re-used', () => {
      patch(container, () => render(true));
      patch(container, () => render(false));
      const outer = container.childNodes[0];

      expect(assertHTMLElement(outer.childNodes[1]).getAttribute('data-foo'))
          .to.be.null;
    });
  });
});
