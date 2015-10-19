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
  var container;

  function render(items) {
    for(var i=0; i<items.length; i++) {
      var key = items[i].key;
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
    var items = [
      { key: 'one' }
    ];

    patch(container, () => render(items));
    var keyedNode = container.childNodes[0];

    items.unshift({ key : null });
    patch(container, () => render(items));

    expect(container.childNodes).to.have.length(2);
    expect(container.childNodes[0]).to.not.equal(keyedNode);
  });

  it('should not modify DOM nodes with falsey keys', () => {
    var slice = Array.prototype.slice;
    var items = [
      { key: null },
      { key: undefined },
      { key: '' },
    ];

    patch(container, () => render(items));
    var nodes = slice.call(container.childNodes);

    patch(container, () => render(items));

    expect(slice.call(container.childNodes)).to.deep.equal(nodes);
  });

  it('should not modify the DOM nodes when inserting', () => {
    var items = [
      { key: 'one' },
      { key: 'two' }
    ];

    patch(container, () => render(items));
    var firstNode = container.childNodes[0];
    var secondNode = container.childNodes[1];

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
    var items = [
      { key: 'one' },
      { key: 'two' },
      { key: 'three' }
    ];

    patch(container, () => render(items));
    var firstNode = container.childNodes[0];
    var thirdNode = container.childNodes[2];

    items.splice(1, 1);
    patch(container, () => render(items));

    expect(container.childNodes).to.have.length(2);
    expect(container.childNodes[0]).to.equal(firstNode);
    expect(container.childNodes[0].id).to.equal('one');
    expect(container.childNodes[1]).to.equal(thirdNode);
    expect(container.childNodes[1].id).to.equal('three');
  });

  it('should not modify the DOM nodes when re-ordering', () => {
    var items = [
      { key: 'one' },
      { key: 'two' },
      { key: 'three' }
    ];

    patch(container, () => render(items));
    var firstNode = container.childNodes[0];
    var secondNode = container.childNodes[1];
    var thirdNode = container.childNodes[2];

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
    var items = [
      { key: 'hasOwnProperty' }
    ];

    patch(container, () => render(items));
    expect(container.childNodes).to.have.length(1);
  });
});

