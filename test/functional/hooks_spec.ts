//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

import * as Sinon from 'sinon';

import {attributes, elementVoid, notifications, patch, symbols, text} from '../../index';
const {expect} = chai;

describe('library hooks', () => {
  const sandbox = Sinon.sandbox.create();
  let container: HTMLElement;
  let allSpy: Sinon.SinonSpy;
  let stub: Sinon.SinonStub;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    sandbox.restore();
  });

  describe('for deciding how attributes are set', () => {
    // tslint:disable-next-line:no-any
    function render(dynamicValue: any) {
      elementVoid(
          'div', 'key', ['staticName', 'staticValue'], 'dynamicName',
          dynamicValue);
    }

    function stubOut(mutator: string) {
      stub = sandbox.stub();
      attributes[mutator] = stub;
    }

    beforeEach(() => {
      allSpy = sandbox.spy(attributes, symbols.default);
    });

    afterEach(() => {
      for (const mutator in attributes) {
        if (mutator !== symbols.default && mutator !== 'style') {
          delete attributes[mutator];
        }
      }
    });


    describe('for static attributes', () => {
      it('should call specific setter', () => {
        stubOut('staticName');

        patch(container, render, 'dynamicValue');
        const el = container.childNodes[0];

        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(el, 'staticName', 'staticValue');
      });

      it('should call generic setter', () => {
        patch(container, render, 'dynamicValue');
        const el = container.childNodes[0];

        expect(allSpy).to.have.been.calledWith(el, 'staticName', 'staticValue');
      });

      it('should prioritize specific setter over generic', () => {
        stubOut('staticName');

        patch(container, render, 'dynamicValue');
        const el = container.childNodes[0];

        expect(stub).to.have.been.calledOnce;
        expect(allSpy).to.have.been.calledOnce;
        expect(allSpy).to.have.been.calledWith(
            el, 'dynamicName', 'dynamicValue');
      });
    });

    describe('for specific dynamic attributes', () => {
      beforeEach(() => {
        stubOut('dynamicName');
      });

      it('should be called for dynamic attributes', () => {
        patch(container, render, 'dynamicValue');
        const el = container.childNodes[0];

        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(el, 'dynamicName', 'dynamicValue');
      });

      it('should be called on attribute update', () => {
        patch(container, render, 'dynamicValueOne');
        patch(container, render, 'dynamicValueTwo');
        const el = container.childNodes[0];

        expect(stub).to.have.been.calledTwice;
        expect(stub).to.have.been.calledWith(
            el, 'dynamicName', 'dynamicValueTwo');
      });

      it('should only be called when attributes change', () => {
        patch(container, render, 'dynamicValue');
        patch(container, render, 'dynamicValue');
        const el = container.childNodes[0];

        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(el, 'dynamicName', 'dynamicValue');
      });

      it('should prioritize specific setter over generic', () => {
        patch(container, render, 'dynamicValue');
        const el = container.childNodes[0];

        expect(stub).to.have.been.calledOnce;
        expect(allSpy).to.have.been.calledOnce;
        expect(allSpy).to.have.been.calledWith(el, 'staticName', 'staticValue');
      });
    });

    describe('for generic dynamic attributes', () => {
      it('should be called for dynamic attributes', () => {
        patch(container, render, 'dynamicValue');
        const el = container.childNodes[0];

        expect(allSpy).to.have.been.calledWith(
            el, 'dynamicName', 'dynamicValue');
      });

      it('should be called on attribute update', () => {
        patch(container, render, 'dynamicValueOne');
        patch(container, render, 'dynamicValueTwo');
        const el = container.childNodes[0];

        expect(allSpy).to.have.been.calledWith(
            el, 'dynamicName', 'dynamicValueTwo');
      });

      it('should only be called when attributes change', () => {
        patch(container, render, 'dynamicValue');
        patch(container, render, 'dynamicValue');
        const el = container.childNodes[0];

        expect(allSpy).to.have.been.calledTwice;
        expect(allSpy).to.have.been.calledWith(el, 'staticName', 'staticValue');
        expect(allSpy).to.have.been.calledWith(
            el, 'dynamicName', 'dynamicValue');
      });
    });
  });

  describe('for being notified when nodes are created and added to DOM', () => {
    beforeEach(() => {
      notifications.nodesCreated = sandbox.spy((nodes) => {
        expect(nodes[0].parentNode).to.not.equal(null);
      });
    });

    afterEach(() => {
      notifications.nodesCreated = null;
    });

    it('should be called for elements', () => {
      patch(container, function render() {
        elementVoid('div', 'key', ['staticName', 'staticValue']);
      });
      const el = container.childNodes[0];

      expect(notifications.nodesCreated).to.have.been.calledOnce;
      expect(notifications.nodesCreated).calledWith([el]);
    });

    it('should be called for text', () => {
      patch(container, function render() {
        text('hello');
      });
      const el = container.childNodes[0];

      expect(notifications.nodesCreated).to.have.been.calledOnce;
      expect(notifications.nodesCreated).calledWith([el]);
    });
  });

  describe('for being notified when nodes are deleted from the DOM', () => {
    function render(withTxt) {
      if (withTxt) {
        text('hello');
      } else {
        elementVoid('div', 'key2', ['staticName', 'staticValue']);
      }
    }

    function empty() {}

    beforeEach(() => {
      notifications.nodesDeleted = sandbox.spy((nodes) => {
        expect(nodes[0].parentNode).to.equal(null);
      });
    });

    afterEach(() => {
      notifications.nodesDeleted = null;
    });

    it('should be called for detached element', () => {
      patch(container, render, false);
      const el = container.childNodes[0];
      patch(container, empty);

      expect(notifications.nodesDeleted).to.have.been.calledOnce;
      expect(notifications.nodesDeleted).calledWith([el]);
    });

    it('should be called for detached text', () => {
      patch(container, render, true);
      const el = container.childNodes[0];
      patch(container, empty);

      expect(notifications.nodesDeleted).to.have.been.calledOnce;
      expect(notifications.nodesDeleted).calledWith([el]);
    });

    it('should be called for replaced element', () => {
      patch(container, render, false);
      const el = container.childNodes[0];
      patch(container, render, true);

      expect(notifications.nodesDeleted).to.have.been.calledOnce;
      expect(notifications.nodesDeleted).calledWith([el]);
    });

    it('should be called for removed text', () => {
      patch(container, render, true);
      const el = container.childNodes[0];
      patch(container, render, false);

      expect(notifications.nodesDeleted).to.have.been.calledOnce;
      expect(notifications.nodesDeleted).calledWith([el]);
    });
  });

  describe('for not being notified when Elements are reordered', () => {
    function render(first) {
      if (first) {
        elementVoid('div', 'keyA', ['staticName', 'staticValue']);
      }
      elementVoid('div', 'keyB');
      if (!first) {
        elementVoid('div', 'keyA', ['staticName', 'staticValue']);
      }
    }

    beforeEach(() => {
      notifications.nodesDeleted = sandbox.spy();
    });

    afterEach(() => {
      notifications.nodesDeleted = null;
    });

    it('should not call the nodesDeleted callback', () => {
      patch(container, render, true);
      patch(container, render, false);
      expect(notifications.nodesDeleted).to.have.callCount(0);
    });
  });
});
