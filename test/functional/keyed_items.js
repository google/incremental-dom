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

import {patch, elementVoid} from '../../index';

describe('rendering with keys', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('for an array of items', () => {
    function render(items) {
      for(let i=0; i<items.length; i++) {
        elementVoid('div', items[i].key, ['id', items[i].key]);
      }
    }

    it('should not modify the DOM nodes when inserting', () => {
      let items = [
        { key: 'one' },
        { key: 'two' }
      ];

      patch(container, () => render(items));
      let firstNode = container.childNodes[0];
      let secondNode = container.childNodes[1];

      items.splice(1, 0, { key: 'one-point-five' });
      patch(container, () => render(items));

      expect(container.childNodes.length).to.equal(3);
      expect(container.childNodes[0]).to.equal(firstNode);
      expect(container.childNodes[0].id).to.equal('one');
      expect(container.childNodes[1].id).to.equal('one-point-five');
      expect(container.childNodes[2]).to.equal(secondNode);
      expect(container.childNodes[2].id).to.equal('two');
    });

    it('should not modify the DOM nodes when removing', () => {
      let items = [
        { key: 'one' },
        { key: 'two' },
        { key: 'three' }
      ];

      patch(container, () => render(items));
      let firstNode = container.childNodes[0];
      let thirdNode = container.childNodes[2];

      items.splice(1, 1);
      patch(container, () => render(items));

      expect(container.childNodes.length).to.equal(2);
      expect(container.childNodes[0]).to.equal(firstNode);
      expect(container.childNodes[0].id).to.equal('one');
      expect(container.childNodes[1]).to.equal(thirdNode);
      expect(container.childNodes[1].id).to.equal('three');
    });

    it('should not modify the DOM nodes when re-ordering', () => {
      let items = [
        { key: 'one' },
        { key: 'two' },
        { key: 'three' }
      ];

      patch(container, () => render(items));
      let firstNode = container.childNodes[0];
      let secondNode = container.childNodes[1];
      let thirdNode = container.childNodes[2];

      items.splice(1, 1);
      items.push({ key: 'two' });
      patch(container, () => render(items));

      expect(container.childNodes.length).to.equal(3);
      expect(container.childNodes[0]).to.equal(firstNode);
      expect(container.childNodes[0].id).to.equal('one');
      expect(container.childNodes[1]).to.equal(thirdNode);
      expect(container.childNodes[1].id).to.equal('three');
      expect(container.childNodes[2]).to.equal(secondNode);
      expect(container.childNodes[2].id).to.equal('two');
    });
  });
});

