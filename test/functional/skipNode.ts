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
import {elementVoid, patch, skipNode} from '../../index';
const {expect} = chai;


describe('skip', () => {
  let container;
  let firstChild;
  let lastChild;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = '<div></div><span></span>';

    firstChild = container.firstChild;
    lastChild = container.lastChild;

    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should keep nodes that were skipped at the start', () => {
    patch(container, () => {
      skipNode();
      elementVoid('span');
    });

    expect(container.firstChild).to.equal(firstChild);
    expect(container.lastChild).to.equal(lastChild);
  });

  it('should keep nodes that were skipped', () => {
    patch(container, () => {
      elementVoid('div');
      skipNode();
    });

    expect(container.lastChild).to.equal(lastChild);
  });
});
