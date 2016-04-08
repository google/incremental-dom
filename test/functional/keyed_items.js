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
  elementVoid
} from '../../index';


describe('rendering with keys', () => {
  let container;

  function render(items) {
    for(let i=0; i<items.length; i++) {
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
    const items = [
      { key: 'one' }
    ];

    patch(container, () => render(items));
    const keyedNode = container.childNodes[0];

    items.unshift({ key : null });
    patch(container, () => render(items));

    expect(container.childNodes).to.have.length(2);
    expect(container.childNodes[0]).to.not.equal(keyedNode);
  });

  it('should not modify DOM nodes with falsey keys', () => {
    const slice = Array.prototype.slice;
    const items = [
      { key: null },
      { key: undefined },
      { key: '' },
    ];

    patch(container, () => render(items));
    const nodes = slice.call(container.childNodes);

    patch(container, () => render(items));

    expect(slice.call(container.childNodes)).to.deep.equal(nodes);
  });

  it('should not modify the DOM nodes when inserting', () => {
    const items = [
      { key: 'one' },
      { key: 'two' }
    ];

    patch(container, () => render(items));
    const firstNode = container.childNodes[0];
    const secondNode = container.childNodes[1];

    items.splice(1, 0, { key: 'one-point-five' });
    patch(container, () => render(items));

    expect(container.childNodes).to.have.length(3);
    expect(container.childNodes[0]).to.equal(firstNode);
    expect(container.childNodes[0].id).to.equal('one');
    expect(container.childNodes[1].id).to.equal('one-point-five');
    expect(container.childNodes[2]).to.equal(secondNode);
    expect(container.childNodes[2].id).to.equal('two');
  });

  it('should not modify the DOM nodes when removing', () => {
    const items = [
      { key: 'one' },
      { key: 'two' },
      { key: 'three' }
    ];

    patch(container, () => render(items));
    const firstNode = container.childNodes[0];
    const thirdNode = container.childNodes[2];

    items.splice(1, 1);
    patch(container, () => render(items));

    expect(container.childNodes).to.have.length(2);
    expect(container.childNodes[0]).to.equal(firstNode);
    expect(container.childNodes[0].id).to.equal('one');
    expect(container.childNodes[1]).to.equal(thirdNode);
    expect(container.childNodes[1].id).to.equal('three');
  });

  it('should not modify the DOM nodes when re-ordering', () => {
    const items = [
      { key: 'one' },
      { key: 'two' },
      { key: 'three' }
    ];

    patch(container, () => render(items));
    const firstNode = container.childNodes[0];
    const secondNode = container.childNodes[1];
    const thirdNode = container.childNodes[2];

    items.splice(1, 1);
    items.push({ key: 'two' });
    patch(container, () => render(items));

    expect(container.childNodes).to.have.length(3);
    expect(container.childNodes[0]).to.equal(firstNode);
    expect(container.childNodes[0].id).to.equal('one');
    expect(container.childNodes[1]).to.equal(thirdNode);
    expect(container.childNodes[1].id).to.equal('three');
    expect(container.childNodes[2]).to.equal(secondNode);
    expect(container.childNodes[2].id).to.equal('two');
  });

  it('should avoid collisions with Object.prototype', () => {
    const items = [
      { key: 'hasOwnProperty' }
    ];

    patch(container, () => render(items));
    expect(container.childNodes).to.have.length(1);
  });

  it('should throw error when element does not match nodeName', () => {
    function render(tag) {
      elementVoid(tag, 'key');
    }

    patch(container, render, 'div');

    expect(() => {
      patch(container, render, 'span');
    }).to.throw('Was expecting node with key "key" to be a span, not a div.');
  });

  it('should preserve nodes already in the DOM', () => {
    function render() {
      elementVoid('div', 'key');
      elementVoid('div');
    }

    container.innerHTML = `
      <div></div>
      <div key="key"><div>
    `;

    const keyedDiv = container.lastChild;
    patch(container, render);

    expect(container.firstChild).to.equal(keyedDiv);
  });
});

