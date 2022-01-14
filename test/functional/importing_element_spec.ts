//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

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
