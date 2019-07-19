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

import * as Sinon from 'sinon';

import {elementClose, elementOpen, elementVoid, importNode, patch} from '../../index';
const {expect} = chai;

describe('importing element', () => {
  let container: HTMLElement;
  const sandbox = Sinon.sandbox.create();

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    sandbox.restore();
    document.body.removeChild(container);
  });

  describe('in HTML', () => {
    it('handles normal nodeName capitalization', () => {
      container.innerHTML = '<div></div>';
      importNode(container);

      const el = container.firstChild;
      patch(container, () => elementVoid('div'));
      expect(container.firstChild).to.equal(el);
    });

    it('handles odd nodeName capitalization', () => {
      container.innerHTML = '<dIv></dIv>';
      importNode(container);

      const el = container.firstChild;
      patch(container, () => elementVoid('div'));
      expect(container.firstChild).to.equal(el);
    });
  });

  describe('in SVG', () => {
    it('handles normal nodeName capitalization', () => {
      container.innerHTML = '<svg><foreignObject></foreignObject></svg>';
      importNode(container);

      const foreign = container.firstChild!.firstChild;
      patch(container, () => {
        elementOpen('svg');
        elementVoid('foreignObject');
        elementClose('svg');
      });
      expect(container.firstChild!.firstChild).to.equal(foreign);
    });

    it('handles odd nodeName capitalization', () => {
      container.innerHTML = '<svg><foreignobject></foreignobject></svg>';
      importNode(container);

      const foreign = container.firstChild!.firstChild;
      patch(container, () => {
        elementOpen('svg');
        elementVoid('foreignObject');
        elementClose('svg');
      });
      expect(container.firstChild!.firstChild).to.equal(foreign);
    });
  });
});
