//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

// taze: mocha from //third_party/javascript/typings/mocha
// taze: chai from //third_party/javascript/typings/chai

import {
  currentElement,
  currentPointer,
  elementClose,
  elementOpen,
  elementVoid,
  getKey,
  isDataInitialized,
  patch,
  setKeyAttributeName,
  skip,
  text,
  clearCache,
} from '../../index';
import {assertHTMLElement, attachShadow, BROWSER_SUPPORTS_SHADOW_DOM,} from '../util/dom';
const {expect} = chai;

interface Key {
  key: string|null|undefined;
}


describe('rendering with keys', () => {
  let container: HTMLElement;

  function render(items: Key[]) {
    for (let i = 0; i < items.length; i++) {
      const key = items[i].key;
      elementVoid('div', key, key ? ['id', key] : null);
    }
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should not re-use a node with a non-null key', () => {
    const items: Key[] = [{key: 'one'}];

    patch(container, () => render(items));
    const keyedNode = assertHTMLElement(container.childNodes[0]);

    items.unshift({key: null});
    patch(container, () => render(items));

    expect(container.childNodes).to.have.length(2);
    expect(assertHTMLElement(container.childNodes[0])).to.not.equal(keyedNode);
  });

  it('should not modify DOM nodes with falsey keys', () => {
    const slice = Array.prototype.slice;
    const items = [{key: null}, {key: undefined}, {key: ''}];

    patch(container, () => render(items));
    const nodes = slice.call(container.childNodes);

    patch(container, () => render(items));

    expect(slice.call(container.childNodes)).to.deep.equal(nodes);
  });

  it('should not modify the DOM nodes when inserting', () => {
    const items = [{key: 'one'}, {key: 'two'}];

    patch(container, () => render(items));
    const firstNode = assertHTMLElement(container.childNodes[0]);
    const secondNode = assertHTMLElement(container.childNodes[1]);

    items.splice(1, 0, {key: 'one-point-five'});
    patch(container, () => render(items));

    expect(container.childNodes).to.have.length(3);
    expect(assertHTMLElement(container.childNodes[0])).to.equal(firstNode);
    expect(assertHTMLElement(container.childNodes[0]).id).to.equal('one');
    expect(assertHTMLElement(container.childNodes[1]).id)
        .to.equal('one-point-five');
    expect(assertHTMLElement(container.childNodes[2])).to.equal(secondNode);
    expect(assertHTMLElement(container.childNodes[2]).id).to.equal('two');
  });

  it('should not modify the DOM nodes when removing', () => {
    const items = [{key: 'one'}, {key: 'two'}, {key: 'three'}];

    patch(container, () => render(items));
    const firstNode = assertHTMLElement(container.childNodes[0]);
    const thirdNode = assertHTMLElement(container.childNodes[2]);

    items.splice(1, 1);
    patch(container, () => render(items));

    expect(container.childNodes).to.have.length(2);
    expect(assertHTMLElement(container.childNodes[0])).to.equal(firstNode);
    expect(assertHTMLElement(container.childNodes[0]).id).to.equal('one');
    expect(assertHTMLElement(container.childNodes[1])).to.equal(thirdNode);
    expect(assertHTMLElement(container.childNodes[1]).id).to.equal('three');
  });

  it('should not modify the DOM nodes when re-ordering', () => {
    const items = [{key: 'one'}, {key: 'two'}, {key: 'three'}];

    patch(container, () => render(items));
    const firstNode = assertHTMLElement(container.childNodes[0]);
    const secondNode = assertHTMLElement(container.childNodes[1]);
    const thirdNode = assertHTMLElement(container.childNodes[2]);

    items.splice(1, 1);
    items.push({key: 'two'});
    patch(container, () => render(items));

    expect(container.childNodes).to.have.length(3);
    expect(assertHTMLElement(container.childNodes[0])).to.equal(firstNode);
    expect(assertHTMLElement(container.childNodes[0]).id).to.equal('one');
    expect(assertHTMLElement(container.childNodes[1])).to.equal(thirdNode);
    expect(assertHTMLElement(container.childNodes[1]).id).to.equal('three');
    expect(assertHTMLElement(container.childNodes[2])).to.equal(secondNode);
    expect(assertHTMLElement(container.childNodes[2]).id).to.equal('two');
  });

  it('should avoid collisions with Object.prototype', () => {
    const items = [{key: 'hasOwnProperty'}];

    patch(container, () => render(items));
    expect(container.childNodes).to.have.length(1);
  });

  it('should not reuse dom node when nodeName doesn\'t match', () => {
    // tslint:disable-next-line:no-any
    function render(tag: any) {
      elementVoid(tag, 'key');
    }

    patch(container, render, 'div');
    const firstNode = assertHTMLElement(container.childNodes[0]);

    patch(container, render, 'span');
    const newNode = assertHTMLElement(container.childNodes[0]);
    expect(newNode).not.to.equal(firstNode);
    expect(newNode.nodeName).to.equal('SPAN');
    expect(firstNode.parentNode).to.equal(null);
  });

  it('should update the mapping when a keyed item does not match', () => {
    function renderOne(tag: unknown) {
      elementVoid('div', 'keyOne');
      elementVoid(tag as string, 'keyTwo');
    }

    function renderTwo(tag: unknown) {
      elementVoid(tag as string, 'keyTwo');
    }

    patch(container, renderOne, 'div');
    patch(container, renderOne, 'span');
    const newNode = container.lastChild;
    patch(container, renderTwo, 'span');

    expect(newNode).to.equal(container.lastChild);
  });

  it('should patch correctly when child in key map is manually removed', () => {
    patch(container, () => elementVoid('div', 'key'));
    const firstNode = container.firstChild!;

    container.removeChild(firstNode);

    patch(container, () => elementVoid('span', 'key'));
    const newNode = container.firstChild;
    expect(newNode!.nodeName).to.equal('SPAN');
  });

  describe('non-unique keys', () => {
    it('should render all items', () => {
      const items: Key[] = [{key: 'one'}, {key: 'one'}];
      patch(container, () => render(items));

      expect(container.childNodes).to.have.length(2);
    });

    it('should reuse items in order', () => {
      const items: Key[] = [{key: 'one'}, {key: 'two'}, {key: 'one'}];
      patch(container, () => render(items));
      const first = container.childNodes[0];
      const second = container.childNodes[2];

      const newItems: Key[] = [{key: 'one'}, {key: 'one'}];
      patch(container, () => render(newItems));

      expect(container.childNodes).to.have.length(2);
      expect(container.childNodes[0]).to.equal(first);
      expect(container.childNodes[1]).to.equal(second);
    });
  });

  it('should preserve nodes already in the DOM', () => {
    function render() {
      elementOpen('div', 0);
        text('Foo');
      elementClose('div');
      elementVoid('div', 1);
    }

    const config = {
      'childList': true,
      'attributes': true,
      'characterData': true,
      'subtree': true,
    };
    patch(container, render);
    // Simulate serverside rendering by clearing the cache.
    clearCache(container);
    const observer = new MutationObserver(() => {});
    observer.observe(container, config);
    patch(container, render);

    expect(observer.takeRecords()).to.be.empty;
  });

  describe('an item with focus', () => {
    function render(items: Key[]) {
      for (let i = 0; i < items.length; i++) {
        const key = items[i].key;
        elementOpen('div', key);
        elementVoid('div', null, null, 'id', key!, 'tabindex', -1);
        elementClose('div');
      }
    }

    it('should retain focus when importing DOM with inferred keys', () => {
      const items = [{key: 'one'}, {key: 'two'}];

      patch(container, () => render(items));
      const focusNode = assertHTMLElement(container.querySelector('#two'));
      focusNode.focus();
      // Simulate serverside rendering by clearing the cache.
      clearCache(container);
      patch(container, () => render(items));

      expect(document.activeElement).to.equal(focusNode);
    });

    it('should retain focus when prepending a new item', () => {
      const items = [{key: 'one'}];

      patch(container, () => render(items));
      const focusNode = assertHTMLElement(container.querySelector('#one'));
      focusNode.focus();

      items.unshift({key: 'zero'});
      patch(container, () => render(items));

      expect(document.activeElement).to.equal(focusNode);
    });

    it('should retain focus when moving up in DOM order', () => {
      const items: Key[] = [{key: 'one'}, {key: 'two'}, {key: 'three'}];

      patch(container, () => render(items));
      const focusNode = assertHTMLElement(container.querySelector('#three'));
      focusNode.focus();

      items.unshift(items.pop()!);
      patch(container, () => render(items));

      expect(document.activeElement).to.equal(focusNode);
    });

    it('should retain focus when moving down in DOM order', () => {
      const items = [{key: 'one'}, {key: 'two'}, {key: 'three'}];

      patch(container, () => render(items));
      const focusNode = assertHTMLElement(container.querySelector('#one'));
      focusNode.focus();

      items.push(items.shift()!);
      patch(container, () => render(items));

      expect(document.activeElement).to.equal(focusNode);
    });

    it('should retain focus when doing a nested patch of a subtree', () => {
      function renderInner(id: string|null|undefined) {
        elementVoid('div', null, null, 'id', id as string, 'tabindex', -1);
      }

      function render(item: Key[]) {
        for (let i = 0; i < items.length; i++) {
          const key = items[i].key;
          elementOpen('div', key, null);
          patch(currentElement(), () => renderInner(key));
          skip();
          elementClose('div');
        }
      }

      const items: Key[] = [{key: 'one'}, {key: 'two'}, {key: 'three'}];

      patch(container, () => render(items));
      const focusNode = assertHTMLElement(container.querySelector('#three'));
      focusNode.focus();

      items.unshift(items.pop()!);
      patch(container, () => render(items));

      expect(document.activeElement).to.equal(focusNode);
    });

    it('should retain focus when doing a nested patch of another tree', () => {
      function renderOuter(items: Key[]) {
        elementOpen('div', null, null);
        patch(containerTwo, () => render(items));
        elementClose('div');
      }

      const containerTwo = document.createElement('div');
      const items: Key[] = [{key: 'one'}, {key: 'two'}, {key: 'three'}];

      document.body.appendChild(containerTwo);
      patch(container, () => renderOuter(items));
      const focusNode = assertHTMLElement(containerTwo.querySelector('#three'));
      focusNode.focus();

      items.unshift(items.pop()!);
      patch(container, () => renderOuter(items));

      expect(document.activeElement).to.equal(focusNode);
    });

    if (BROWSER_SUPPORTS_SHADOW_DOM) {
      it('should retain focus when patching a ShadowRoot', () => {
        const items = [{key: 'one'}];

        const shadowRoot = attachShadow(container);
        patch(shadowRoot, () => render(items));
        const focusNode = assertHTMLElement(shadowRoot.querySelector('#one'));
        focusNode.focus();

        items.unshift({key: 'zero'});
        patch(shadowRoot, () => render(items));

        expect(shadowRoot.activeElement).to.equal(focusNode);
        expect(document.activeElement).to.equal(container);
      });

      it('should retain focus when patching outside a ShadowRoot', () => {
        const items = [{key: 'one'}];

        const shadowRoot = attachShadow(container);
        const shadowEl = shadowRoot.appendChild(document.createElement('div'));
        shadowEl.tabIndex = -1;
        shadowEl.focus();

        items.unshift({key: 'zero'});
        patch(container, () => render(items));

        expect(shadowRoot.activeElement).to.equal(shadowEl);
      });
    }
  });
});

describe('isDataInitialized', () => {
  it('should return false if the element has no data', () => {
    const div = document.createElement('div');
    expect(isDataInitialized(div)).to.be.false;
  });

  it('should return true if the element has initialized data', () => {
    const div = document.createElement('div');
    patch(div, () => {
      elementVoid('div', '3');
    });
    expect(isDataInitialized(div.firstChild!)).to.be.true;
  });
});

describe('getKey', () => {
  it('should fail if the element has no node data', () => {
    const div = document.createElement('div');
    expect(() => {
      getKey(div);
    }).to.throw('Expected value to be defined');
  });

  it('should return undefined if the element has no key', () => {
    const div = document.createElement('div');
    patch(div, () => {
      elementVoid('div');
    });
    expect(getKey(div.firstChild!)).to.be.undefined;
  });

  it('should return a key if the element has a key', () => {
    const div = document.createElement('div');
    patch(div, () => {
      elementVoid('div', '3');
    });
    expect(getKey(div.firstChild!)).to.equal('3')
  });
});

describe('setKeyAttributeName', () => {
  let container: HTMLElement;
  let keyedEl: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    keyedEl = document.createElement('div');
    keyedEl.setAttribute('key', 'foo');
    keyedEl.setAttribute('secondaryKey', 'bar');
    container.appendChild(keyedEl);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    setKeyAttributeName('key'); // Default.
  });

  it('should use the default `key` attribute as the source-of-truth key',
    () => {
      patch(container, () => {
        elementVoid('div', 'baz');
      });
      expect(getKey(keyedEl)).to.equal('foo');
      // The original keyedEl should have been removed and replaced by a new
      // element, since keyedEl did not have a matching key.
      expect(container.firstChild).to.not.equal(keyedEl);
    });

  it('should use the `secondaryKey` attribute if keyAttributeName is set to ' +
      '`secondaryKey`',
     () => {
       setKeyAttributeName('secondaryKey');

       patch(container, () => {
         elementVoid('div', 'baz');
       });
       expect(getKey(keyedEl)).to.equal('bar');
       // The original keyedEl should have been removed and replaced by a new
       // element, since keyedEl did not have a matching key.
       expect(container.firstChild).to.not.equal(keyedEl);
     });

  it('should use the given key if `keyAttributeName` is set to null', () => {
    setKeyAttributeName(null);

    patch(container, () => {
      elementVoid('div', 'baz');
    });
    expect(getKey(keyedEl)).to.equal('baz');
    expect(container.firstChild).to.equal(keyedEl);
  });
});
