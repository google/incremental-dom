//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import {elementOpen, elementClose, patch} from '../../index';
import * as Sinon from 'sinon';

const {expect} = chai;

/*
 * These tests just capture the current state of mutations that occur when
 * changing the items. These could change in the future.
 */
describe('keyed items', () => {
  let container: HTMLElement;
  const sandbox = Sinon.sandbox.create();
  const mutationObserverConfig = {
    childList: true,
    subtree: true,
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    sandbox.restore();
    document.body.removeChild(container);
  });

  /**
   * @param container
   */
  function createMutationObserver(container: Element): MutationObserver {
    const mo = new MutationObserver(() => {});
    mo.observe(container, mutationObserverConfig);

    return mo;
  }

  /**
   * @param keys
   */
  function render(keys: number[]) {
    keys.forEach((key) => {
      elementOpen('div', key);
      elementClose('div');
    });
  }

  it('should cause no mutations when the items stay the same', () => {
    patch(container, () => render([1, 2, 3]));

    const mo = createMutationObserver(container);
    patch(container, () => render([1, 2, 3]));

    const records = mo.takeRecords();
    expect(records).to.be.empty;
  });

  it('causes only one mutation when adding a new item', () => {
    patch(container, () => render([1, 2, 3]));

    const mo = createMutationObserver(container);
    patch(container, () => render([0, 1, 2, 3]));

    const records = mo.takeRecords();
    expect(records).to.have.length(1);
  });

  it('cause a removal and addition when moving forwards', () => {
    patch(container, () => render([1, 2, 3]));

    const mo = createMutationObserver(container);
    patch(container, () => render([3, 1, 2]));

    const records = mo.takeRecords();
    expect(records).to.have.length(2);
    expect(records[0].addedNodes).to.have.length(0);
    expect(records[0].removedNodes).to.have.length(1);
    expect(records[1].addedNodes).to.have.length(1);
    expect(records[1].removedNodes).to.have.length(0);
  });

  it('causes mutations for each item when removing from the start', () => {
    patch(container, () => render([1, 2, 3, 4]));

    const mo = createMutationObserver(container);
    patch(container, () => render([2, 3, 4]));

    const records = mo.takeRecords();
    // 7 Mutations: two for each of the nodes moving forward and one for the
    // removal.
    expect(records).to.have.length(7);
  });
});
