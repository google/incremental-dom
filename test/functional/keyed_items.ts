/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
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

// taze: mocha from //third_party/javascript/typings/mocha
// taze: chai from //third_party/javascript/typings/chai

import {currentElement, elementClose, elementOpen, elementVoid, patch, skip, text, clearCache} from '../../index';
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
    function renderOne(tag: {}|undefined) {
      elementVoid('div', 'keyOne');
      elementVoid(tag as string, 'keyTwo');
    }

    function renderTwo(tag: {}|undefined) {
      elementVoid(tag as string, 'keyTwo');
    }

    patch(container, renderOne, 'div');
    patch(container, renderOne, 'span');
    const newNode = container.lastChild;
    patch(container, renderTwo, 'span');

    expect(newNode).to.equal(container.lastChild);
  });

  it('should patch correctly when child in key map is manually removed', () => {
    function render(tag: {}|undefined) {
      elementVoid(tag as string, 'key');
    }

    patch(container, render, 'div');
    const firstNode = container.firstChild!;

    container.removeChild(firstNode);

    patch(container, render, 'span');
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

    it('should retain focus when doing a nested patch', () => {
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
