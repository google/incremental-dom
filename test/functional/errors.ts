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

import * as Sinon from 'sinon';

import {attr, currentElement, elementClose, elementOpen, elementOpenEnd, elementOpenStart, elementVoid, patch} from '../../index';
const {expect} = chai;

describe('Errors while rendering', () => {
  let container: HTMLElement;
  const sandbox = Sinon.sandbox.create();

  function patchWithUnclosedElement() {
    expect(() => {
      patch(currentElement(), () => {
        elementOpen('div');
        throw new Error('Never closed element!');
      });
    }).to.throw('Never closed element!');
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    sandbox.restore();
    document.body.removeChild(container);
  });

  it('should continue patching', () => {
    patch(container, () => {
      elementOpen('div');

      elementOpen('div');
      patchWithUnclosedElement();
      elementClose('div');

      elementVoid('div');
      elementClose('div');
    });

    const el = container.children[0];
    expect(el.children).to.have.length(2);
  });

  it('should restore state while an element is open', () => {
    patch(container, () => {
      elementOpen('div');

      elementOpen('div');
      patchWithUnclosedElement();
      elementClose('div');

      elementVoid('span');
      elementClose('div');
    });

    const el = container.children[0];
    expect(el.children).to.have.length(2);
    expect(el.children[1].tagName).to.equal('SPAN');
  });

  it('should restore state while calling elementOpenStart', () => {
    patch(container, () => {
      const otherContainer = document.createElement('div');

      elementOpenStart('div');
      attr('parrentAttrOne', 'parrentAttrValOne');

      expect(() => {
        patch(otherContainer, () => {
          elementOpenStart('div');
          attr('childAttr', 'childAttrVal');
          throw new Error();
        });
      }).to.throw();

      attr('parrentAttrTwo', 'parrentAttrValTwo');
      elementOpenEnd();

      elementClose('div');
    });

    const attributes = container.children[0].attributes;
    expect(attributes).to.have.length(2);
    expect(attributes['parrentAttrOne'].value).to.equal('parrentAttrValOne');
    expect(attributes['parrentAttrTwo'].value).to.equal('parrentAttrValTwo');
  });

  it('should render any partial elements', () => {
    expect(() => {
      patch(container, () => {
        elementVoid('div');
        elementOpen('div');
        elementOpen('div');
        throw new Error();
      });
    }).to.throw();

    const el = container.children[1];
    expect(container.children).to.have.length(2);
    expect(el.children).to.have.length(1);
  });
});
