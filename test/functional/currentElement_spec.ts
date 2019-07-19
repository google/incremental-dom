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

import {currentElement, elementClose, elementOpen, elementOpenEnd, elementOpenStart, elementVoid, patch} from '../../index';
const {expect} = chai;


describe('currentElement', () => {
  let container: HTMLElement;
  let el: Element|null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    el = null;
  });

  it('should return the element from elementOpen', () => {
    patch(container, () => {
      elementOpen('div');
      el = currentElement();
      elementClose('div');
    });
    expect(el).to.equal(container.childNodes[0]);
  });

  it('should return the element from elementOpenEnd', () => {
    patch(container, () => {
      elementOpenStart('div');
      elementOpenEnd();
      el = currentElement();
      elementClose('div');
    });

    expect(el).to.equal(container.childNodes[0]);
  });

  it('should return the parent after elementClose', () => {
    patch(container, () => {
      elementOpen('div');
      elementClose('div');
      el = currentElement();
    });

    expect(el).to.equal(container);
  });

  it('should return the parent after elementVoid', () => {
    patch(container, () => {
      elementVoid('div');
      el = currentElement();
    });

    expect(el).to.equal(container);
  });

  it('should throw an error if not patching', () => {
    expect(currentElement).to.throw('Cannot call currentElement() unless in patch');
  });

  it('should throw an error if inside virtual attributes element', () => {
    expect(() => {
      patch(container, () => {
        elementOpenStart('div');
        el = currentElement();
        elementOpenEnd();
        elementClose('div');
      });
    }).to.throw('currentElement() can not be called between elementOpenStart() and elementOpenEnd().');
  });
});
