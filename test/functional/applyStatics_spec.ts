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

import {applyStatics, close, open, patch} from '../../index';
const {expect} = chai;

 /**
 * @param container
 */
function createMutationObserver(container: Element): MutationObserver {
  const mo = new MutationObserver(() => {});
  mo.observe(container, {
    attributes: true,
    subtree: true,
  });

  return mo;
}

describe('applyStatics', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should add attributes to the current element when created', () => {
    patch(container, () => {
      open('div');
      applyStatics(['nameOne', 'valueOne', 'nameTwo', 'valueTwo']);
      close();
    });

    const firstChild = container.children[0];
    expect(firstChild.attributes).to.have.length(2);
    expect(firstChild.getAttribute('nameOne')).to.equal('valueOne');
    expect(firstChild.getAttribute('nameTwo')).to.equal('valueTwo');
  });

  it('should add attributes if called after a subtree', () => {
    patch(container, () => {
      open('div');
      open('span');
      close();

      applyStatics(['nameOne', 'valueOne', 'nameTwo', 'valueTwo']);
      close();
    });

    const firstChild = container.children[0];
    expect(firstChild.attributes).to.have.length(2);
    expect(firstChild.getAttribute('nameOne')).to.equal('valueOne');
    expect(firstChild.getAttribute('nameTwo')).to.equal('valueTwo');
  });

  it('should not re-apply if the statics changed', () => {
    patch(container, () => {
      open('div');
      applyStatics(['nameOne', 'valueOne', 'nameTwo', 'valueTwo']);
      close();
    });

    const mo = createMutationObserver(container);

    patch(container, () => {
      open('div');
      applyStatics(['nameOne', 'valueOneNew', 'nameThree', 'valueThree']);
      close();
    });

    expect(mo.takeRecords()).to.be.empty;
  });
});