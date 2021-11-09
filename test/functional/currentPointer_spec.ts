//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import {currentPointer, elementClose, elementOpenEnd, elementOpenStart, elementVoid, patch} from '../../index';
import {assertHTMLElement,} from '../util/dom';
const {expect} = chai;

describe('currentPointer', () => {
  let container: HTMLElement;
  let firstChild: HTMLElement;
  let lastChild: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `<div></div><span></span>`;

    firstChild = assertHTMLElement(container.firstChild);
    lastChild = assertHTMLElement(container.lastChild);

    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should return null if no children', () => {
    container.innerHTML = '';

    let el;

    patch(container, () => {
      el = currentPointer();
    });

    expect(el).to.equal(null);
  });

  it('should return the first child when an element was just opened', () => {
    let el;

    patch(container, () => {
      el = currentPointer();
    });

    expect(el).to.equal(firstChild);
  });

  it('should return the next node to evaluate', () => {
    let el;

    patch(container, () => {
      elementVoid('div');
      el = currentPointer();
    });

    expect(el).to.equal(lastChild);
  });

  it('should return null if past the end', () => {
    let el;

    patch(container, () => {
      elementVoid('div');
      elementVoid('span');
      el = currentPointer();
    });

    expect(el).to.equal(null);
  });

  it('should throw an error if not patching', () => {
    expect(currentPointer).to.throw('Cannot call currentPointer() unless in patch');
  });

  it('should throw an error if inside virtual attributes element', () => {
    expect(() => {
      patch(container, () => {
        elementOpenStart('div');
        currentPointer();
        elementOpenEnd();
        elementClose('div');
      });
    }).to.throw('currentPointer() can not be called between elementOpenStart() and elementOpenEnd().');
  });
});
