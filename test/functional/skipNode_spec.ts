//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

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
