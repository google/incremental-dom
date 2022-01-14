//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

// taze: mocha from //third_party/javascript/typings/mocha
// taze: chai from //third_party/javascript/typings/chai
import {elementClose, elementOpen, elementVoid, patchOuter, text} from '../../index';
const {expect} = chai;


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
      elementVoid('div', null, null, 'tabindex', '0');
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
    const containerOne = container.appendChild(document.createElement('div'));
    const containerTwo = container.appendChild(document.createElement('div'));

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

  describe('with an empty patch', () => {
    let div;
    let prev;
    let next;
    let result;

    beforeEach(() => {
      prev = container.appendChild(document.createElement('div'));
      div = container.appendChild(document.createElement('div'));
      next = container.appendChild(document.createElement('div'));

      result = patchOuter(div, () => {});
    });

    it('should remove the DOM node', () => {
      expect(div.parentNode).to.be.null;
      expect(container.children).to.have.length(2);
    });

    it('should leave prior nodes alone', () => {
      expect(container.firstChild).to.equal(prev);
    });

    it('should leaving following nodes alone', () => {
      expect(container.lastChild).to.equal(next);
    });

    it('should return null on an empty patch', () => {
      expect(result).to.be.null;
    });
  });

  describe('with a matching node', () => {
    let div;
    let prev;
    let next;
    let result;

    function render() {
      elementVoid('div');
    }

    beforeEach(() => {
      prev = container.appendChild(document.createElement('div'));
      div = container.appendChild(document.createElement('div'));
      next = container.appendChild(document.createElement('div'));

      result = patchOuter(div, render);
    });

    it('should leave the patched node alone', () => {
      expect(container.children).to.have.length(3);
      expect(container.children[1]).to.equal(div);
    });

    it('should leave prior nodes alone', () => {
      expect(container.firstChild).to.equal(prev);
    });

    it('should leaving following nodes alone', () => {
      expect(container.lastChild).to.equal(next);
    });

    it('should return the patched node', () => {
      expect(result).to.equal(div);
    });
  });

  describe('with a different tag', () => {
    describe('without a key', () => {
      let div;
      let span;
      let prev;
      let next;
      let result;

      function render() {
        elementVoid('span');
      }

      beforeEach(() => {
        prev = container.appendChild(document.createElement('div'));
        div = container.appendChild(document.createElement('div'));
        next = container.appendChild(document.createElement('div'));

        result = patchOuter(div, render);
        span = container.querySelector('span');
      });

      it('should replace the DOM node', () => {
        expect(container.children).to.have.length(3);
        expect(container.children[1]).to.equal(span);
      });

      it('should leave prior nodes alone', () => {
        expect(container.firstChild).to.equal(prev);
      });

      it('should leaving following nodes alone', () => {
        expect(container.lastChild).to.equal(next);
      });

      it('should return the new DOM node', () => {
        expect(result).to.equal(span);
      });
    });

    describe('with a different key', () => {
      let div;
      let prev;
      let next;
      let el;

      function render(data) {
        el = elementVoid(data.tag, data.key);
      }

      beforeEach(() => {
        prev = container.appendChild(document.createElement('div'));
        div = container.appendChild(document.createElement('div'));
        next = container.appendChild(document.createElement('div'));
      });

      describe('when a key changes', () => {
        beforeEach(() => {
          div.setAttribute('key', 'key0');
          patchOuter(div, render, {tag: 'span', key: 'key1'});
        });

        it('should replace the DOM node', () => {
          expect(container.children).to.have.length(3);
          expect(container.children[1]).to.equal(el);
        });

        it('should leave prior nodes alone', () => {
          expect(container.firstChild).to.equal(prev);
        });

        it('should leaving following nodes alone', () => {
          expect(container.lastChild).to.equal(next);
        });
      });

      describe('when a key is removed', () => {
        beforeEach(() => {
          div.setAttribute('key', 'key0');
          patchOuter(div, render, {tag: 'span'});
        });

        it('should replace the DOM node', () => {
          expect(container.children).to.have.length(3);
          expect(container.children[1].tagName).to.equal('SPAN');
          expect(container.children[1]).to.equal(el);
        });

        it('should leave prior nodes alone', () => {
          expect(container.firstChild).to.equal(prev);
        });

        it('should leaving following nodes alone', () => {
          expect(container.lastChild).to.equal(next);
        });
      });

      describe('when a key is added', () => {
        beforeEach(() => {
          patchOuter(div, render, {tag: 'span', key: 'key2'});
        });

        it('should replace the DOM node', () => {
          expect(container.children).to.have.length(3);
          expect(container.children[1]).to.equal(el);
        });

        it('should leave prior nodes alone', () => {
          expect(container.firstChild).to.equal(prev);
        });

        it('should leaving following nodes alone', () => {
          expect(container.lastChild).to.equal(next);
        });
      });
    });
  });

  it('should not hang on to removed elements with keys', () => {
    function render() {
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

    expect(() => patchOuter(div, render))
        .to.throw(
            'There must be ' +
            'exactly one top level call corresponding to the patched element.');
  });
});
