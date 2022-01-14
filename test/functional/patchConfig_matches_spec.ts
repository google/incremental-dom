//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

// taze: mocha from //third_party/javascript/typings/mocha
// taze: chai from //third_party/javascript/typings/chai

import {
  elementVoid,
  createPatchInner,
  createPatchOuter,
  patchInner,
} from '../../index';
import { text, elementOpen, elementClose } from '../../src/virtual_elements';
const {expect} = chai;

describe('patchConfig\'s matches option', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('default matches', () => {
    describe('for createPatchInner', () => {
      it('should match with the same key and node name', () => {
        const patch = createPatchInner();

        patch(container, () => elementVoid('div', 'foo'));
        const postPatchOneChild = container.firstChild;
        patch(container, () => elementVoid('div', 'foo'));

        expect(container.childNodes).to.have.length(1);
        expect(container.firstChild).to.equal(postPatchOneChild);
      });

      it('should match for text nodes', () => {
        const patch = createPatchInner();

        patch(container, () => text('foo'));
        const postPatchOneChild = container.firstChild;
        patch(container, () => text('foo'));

        expect(container.childNodes).to.have.length(1);
        expect(container.firstChild).to.equal(postPatchOneChild);
      });

      it('should not match with different tags', () => {
        const patch = createPatchInner();

        patch(container, () => elementVoid('div', 'foo'));
        const postPatchOneChild = container.firstChild;
        patch(container, () => elementVoid('span', 'foo'));

        expect(container.childNodes).to.have.length(1);
        expect(container.firstChild).to.not.equal(postPatchOneChild);
      });

      it('should not match with different keys', () => {
        const patch = createPatchInner();

        patch(container, () => elementVoid('div', 'foo'));
        const postPatchOneChild = container.firstChild;
        patch(container, () => elementVoid('div', 'bar'));

        expect(container.childNodes).to.have.length(1);
        expect(container.firstChild).to.not.equal(postPatchOneChild);
      });

      it('should default when a config is specified', () => {
        const patch = createPatchInner({});

        patch(container, () => elementVoid('div', 'foo'));
        const postPatchOneChild = container.firstChild;
        patch(container, () => elementVoid('div', 'foo'));

        expect(container.childNodes).to.have.length(1);
        expect(container.firstChild).to.equal(postPatchOneChild);
      });
    });

    describe('for createPatchOuter', () => {
      it('should match with the same key and node name', () => {
        const patch = createPatchOuter();

        patch(container, () => {
          elementOpen('div');
            elementVoid('div', 'foo');
          elementClose('div');
        });
        const postPatchOneChild = container.firstChild;
        patch(container, () => {
          elementOpen('div');
            elementVoid('div', 'foo');
          elementClose('div');
        });

        expect(container.childNodes).to.have.length(1);
        expect(container.firstChild).to.equal(postPatchOneChild);
      });
    });
  });

  describe('custom matches', () => {
    // For the sake of example, uses a matches function 
    const patchTripleEquals = createPatchInner({
      matches: (node, nameOrCtor, expectedNameOrCtor, key, expectedKey) => {
        return nameOrCtor == expectedNameOrCtor && key === expectedKey;
      },
    });

    it('should reuse nodes when matching', () => {
      patchTripleEquals(container, () => elementVoid('div', null));
      const postPatchOneChild = container.firstChild;
      patchTripleEquals(container, () => elementVoid('div', null));

      expect(container.childNodes).to.have.length(1);
      expect(container.firstChild).to.equal(postPatchOneChild);
    });

    it('should reuse nodes when matching', () => {
      patchTripleEquals(container, () => elementVoid('div', null));
      const postPatchOneChild = container.firstChild;
      patchTripleEquals(container, () => elementVoid('div', undefined));

      expect(container.childNodes).to.have.length(1);
      expect(container.firstChild).to.not.equal(postPatchOneChild);
    });

    it('should not effect the default patcher', () => {
      patchTripleEquals(container, () => elementVoid('div', null));
      const postPatchOneChild = container.firstChild;
      patchInner(container, () => elementVoid('div', undefined));

      expect(container.childNodes).to.have.length(1);
      expect(container.firstChild).to.equal(postPatchOneChild);
    });

    it('should not effect other patchers', () => {
      const patchNeverEquals = createPatchInner({
        matches: () => false,
      });

      patchTripleEquals(container, () => elementVoid('div', null));
      const postPatchOneChild = container.firstChild;
      patchNeverEquals(container, () => elementVoid('div', null));

      expect(container.childNodes).to.have.length(1);
      expect(container.firstChild).to.not.equal(postPatchOneChild);
    });
  });
});
