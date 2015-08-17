/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
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

import {
    patch,
    elementVoid,
    mutators
} from '../../index';


describe('library hooks', () => {
  var sandbox = sinon.sandbox.create();
  var container;
  var allSpy;
  var stub;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    sandbox.restore();
  });

  describe('for deciding how attributes are set', () => {
    function render(dynamicValue) {
      elementVoid('div', null, ['staticName', 'staticValue'],
          'dynamicName', dynamicValue);
    }

    function stubOut(mutator) {
      stub = sandbox.stub();
      mutators.attributes[mutator] = stub;
    }

    beforeEach(() => {
      allSpy = sandbox.spy(mutators.attributes, '__all');
    });

    afterEach(() => {
      for (var mutator in mutators.attributes) {
        if (mutator !== '__all') {
          mutators.attributes[mutator] = null;
        }
      }
    });


    describe('for static attributes', () => {
      it('should call specific setter', () => {
        stubOut('staticName');

        patch(container, render, 'dynamicValue');
        var el = container.childNodes[0];

        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(el, 'staticName', 'staticValue');
      });

      it('should call generic setter', () => {
        patch(container, render, 'dynamicValue');
        var el = container.childNodes[0];

        expect(allSpy).to.have.been.calledWith(el, 'staticName', 'staticValue');
      });

      it('should prioritize specific setter over generic', () => {
        stubOut('staticName');

        patch(container, render, 'dynamicValue');
        var el = container.childNodes[0];

        expect(stub).to.have.been.calledOnce;
        expect(allSpy).to.have.been.calledOnce;
        expect(allSpy).to.have.been.calledWith(el, 'dynamicName', 'dynamicValue');
      });
    });

    describe('for specific dynamic attributes', () => {
      beforeEach(() => {
        stubOut('dynamicName');
      });

      it('should be called for dynamic attributes', () => {
        patch(container, render, 'dynamicValue');
        var el = container.childNodes[0];

        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(el, 'dynamicName', 'dynamicValue');
      });

      it('should be called on attribute update', () => {
        patch(container, render, 'dynamicValueOne');
        patch(container, render, 'dynamicValueTwo');
        var el = container.childNodes[0];

        expect(stub).to.have.been.calledTwice;
        expect(stub).to.have.been.calledWith(el, 'dynamicName', 'dynamicValueTwo');
      });

      it('should only be called when attributes change', () => {
        patch(container, render, 'dynamicValue');
        patch(container, render, 'dynamicValue');
        var el = container.childNodes[0];

        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(el, 'dynamicName', 'dynamicValue');
      });

      it('should prioritize specific setter over generic', () => {
        patch(container, render, 'dynamicValue');
        var el = container.childNodes[0];

        expect(stub).to.have.been.calledOnce;
        expect(allSpy).to.have.been.calledOnce;
        expect(allSpy).to.have.been.calledWith(el, 'staticName', 'staticValue');
      });
    });

    describe('for generic dynamic attributes', () => {
      it('should be called for dynamic attributes', () => {
        patch(container, render, 'dynamicValue');
        var el = container.childNodes[0];

        expect(allSpy).to.have.been.calledWith(el, 'dynamicName', 'dynamicValue');
      });

      it('should be called on attribute update', () => {
        patch(container, render, 'dynamicValueOne');
        patch(container, render, 'dynamicValueTwo');
        var el = container.childNodes[0];

        expect(allSpy).to.have.been.calledWith(el, 'dynamicName', 'dynamicValueTwo');
      });

      it('should only be called when attributes change', () => {
        patch(container, render, 'dynamicValue');
        patch(container, render, 'dynamicValue');
        var el = container.childNodes[0];

        expect(allSpy).to.have.been.calledTwice;
        expect(allSpy).to.have.been.calledWith(el, 'staticName', 'staticValue');
        expect(allSpy).to.have.been.calledWith(el, 'dynamicName', 'dynamicValue');
      });
    });
  });
});

