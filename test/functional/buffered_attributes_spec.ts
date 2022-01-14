//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import {applyAttrs, attr, close, open, patch} from '../../index';
const {expect} = chai;

describe('buffered attributes', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should add attributes to the current element', () => {
    patch(container, () => {
      open('div');
      attr('nameOne', 'valueOne');
      attr('nameTwo', 'valueTwo');
      applyAttrs();
      close();

      open('div');
      attr('nameThree', 'valueThree');
      applyAttrs();
      close();
    });

    const firstChild = container.children[0];
    const secondChild = container.children[1];
    expect(firstChild.attributes).to.have.length(2);
    expect(firstChild.getAttribute('nameOne')).to.equal('valueOne');
    expect(firstChild.getAttribute('nameTwo')).to.equal('valueTwo');
    expect(secondChild.attributes).to.have.length(1);
    expect(secondChild.getAttribute('nameThree')).to.equal('valueThree');
  });

  it('should add attributes even when a subtree has been open/closed', () => {
    patch(container, () => {
      open('div');
      open('span');
      close();

      attr('nameOne', 'valueOne');
      attr('nameTwo', 'valueTwo');
      applyAttrs();
      close();
    });

    const firstChild = container.children[0];
    expect(firstChild.attributes).to.have.length(2);
    expect(firstChild.getAttribute('nameOne')).to.equal('valueOne');
    expect(firstChild.getAttribute('nameTwo')).to.equal('valueTwo');
  });
  
  it('should not be left over between patches', () => {
    patch(container, () => {
      attr('nameOne', 'valueOne');
      attr('nameTwo', 'valueTwo');
    });

    patch(container, () => {
      open('div');
      attr('nameThree', 'valueThree');
      applyAttrs();
      close();
    });

    const firstChild = container.children[0];
    expect(firstChild.attributes).to.have.length(1);
    expect(firstChild.getAttribute('nameThree')).to.equal('valueThree');
  });

  it('should not carry over to nested patches', () => {
    const secondContainer = document.createElement('div');

    patch(container, () => {
      attr('nameOne', 'valueOne');
      attr('nameTwo', 'valueTwo');

      patch(secondContainer, () => {
        open('div');
        attr('nameThree', 'valueThree');
        applyAttrs();
        close();
      });
    });

    const firstChild = secondContainer.children[0];
    expect(firstChild.attributes).to.have.length(1);
    expect(firstChild.getAttribute('nameThree')).to.equal('valueThree');
  });

  it('should restore after nested patches', () => {
    const secondContainer = document.createElement('div');

    patch(container, () => {
      attr('nameOne', 'valueOne');
      attr('nameTwo', 'valueTwo');

      patch(secondContainer, () => {
        open('div');
        attr('nameThree', 'valueThree');
        applyAttrs();
        close();
      });

      open('div');
      applyAttrs();
      close();
    });

    const firstChild = container.children[0];
    expect(firstChild.attributes).to.have.length(2);
    expect(firstChild.getAttribute('nameOne')).to.equal('valueOne');
    expect(firstChild.getAttribute('nameTwo')).to.equal('valueTwo');
  });
});