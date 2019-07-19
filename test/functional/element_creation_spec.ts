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

import {elementClose, elementOpen, elementOpenEnd, elementOpenStart, elementVoid, patch} from '../../index';
import {assertElement, assertHTMLElement,} from '../util/dom';

const {expect} = chai;


describe('element creation', () => {
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

  describe('when creating a single node', () => {
    let el: HTMLElement;

    beforeEach(() => {
      patch(container, () => {
        elementVoid('div', 'key', ['id', 'someId', 'class', 'someClass', 'data-custom', 'custom'],
            'data-foo', 'Hello',
            'data-bar', 'World');
      });

      el = assertHTMLElement(container.childNodes[0]);
    });

    it('should render with the specified tag', () => {
      expect(el.tagName).to.equal('DIV');
    });

    it('should render with static attributes', () => {
      expect(el.id).to.equal('someId');
      expect(el.className).to.equal('someClass');
      expect(el.getAttribute('data-custom')).to.equal('custom');
    });

    it('should render with dynamic attributes', () => {
      expect(el.getAttribute('data-foo')).to.equal('Hello');
      expect(el.getAttribute('data-bar')).to.equal('World');
    });

    describe('should return DOM node', () => {
      beforeEach(() => {
        patch(container, () => {});
      });

      it('from elementOpen', () => {
        patch(container, () => {
          el = elementOpen('div');
          elementClose('div');
        });

        expect(el).to.equal(container.childNodes[0]);
      });

      it('from elementClose', () => {
        patch(container, () => {
          elementOpen('div');
          el = assertHTMLElement(elementClose('div'));
        });

        expect(el).to.equal(container.childNodes[0]);
      });

      it('from elementVoid', () => {
        patch(container, () => {
          el = assertHTMLElement(elementVoid('div'));
        });

        expect(el).to.equal(container.childNodes[0]);
      });

      it('from elementOpenEnd', () => {
        patch(container, () => {
          elementOpenStart('div');
          el = elementOpenEnd();
          elementClose('div');
        });

        expect(el).to.equal(container.childNodes[0]);
      });
    });
  });

  it('should allow creation without static attributes', () => {
    patch(container, () => {
      elementVoid('div', null, null,
          'id', 'test');
    });
    const el = assertHTMLElement(container.childNodes[0]);
    expect(el.id).to.equal('test');
  });

  describe('for HTML elements', () => {
    it('should use the XHTML namespace', () => {
      patch(container, () => {
        elementVoid('div');
      });

      const el = container.childNodes[0];
      expect(el.namespaceURI).to.equal('http://www.w3.org/1999/xhtml');
    });

    it('should use createElement if no namespace has been specified', () => {
      const doc = container.ownerDocument!;
      const div = doc.createElement('div');
      let el: HTMLElement;
      sandbox.stub(doc, 'createElement').returns(div);

      patch(container, () => {
        elementOpen('svg');
        elementOpen('foreignObject');
        el = assertHTMLElement(elementVoid('div'));
        expect(el.namespaceURI).to.equal('http://www.w3.org/1999/xhtml');
        elementClose('foreignObject');
        elementClose('svg');
      });

      expect(doc.createElement).to.have.been.calledOnce;
    });
  });

  describe('for svg elements', () => {
    beforeEach(() => {
      patch(container, () => {
        elementOpen('svg');
          elementOpen('g');
            elementVoid('circle');
          elementClose('g');
          elementOpen('foreignObject');
            elementVoid('p');
          elementClose('foreignObject');
          elementVoid('path');
        elementClose('svg');
      });
    });

    it('should create svgs in the svg namespace', () => {
      const el = assertElement(container.querySelector('svg'));
      expect(el.namespaceURI).to.equal('http://www.w3.org/2000/svg');
    });

    it('should create descendants of svgs in the svg namespace', () => {
      const el = assertElement(container.querySelector('circle'));
      expect(el.namespaceURI).to.equal('http://www.w3.org/2000/svg');
    });

    it('should have the svg namespace for foreignObjects', () => {
      const el = assertElement(container.querySelector('svg')!.childNodes[1]);
      expect(el.namespaceURI).to.equal('http://www.w3.org/2000/svg');
    });

    it('should revert to the xhtml namespace when encounering a foreignObject',
       () => {
         const el = assertElement(container.querySelector('p'));
         expect(el.namespaceURI).to.equal('http://www.w3.org/1999/xhtml');
       });

    it('should reset to the previous namespace after exiting a forignObject',
       () => {
         const el = assertElement(container.querySelector('path'));
         expect(el.namespaceURI).to.equal('http://www.w3.org/2000/svg');
       });

    it('should create children in the svg namespace when patching an svg',
       () => {
         const svg = assertElement(container.querySelector('svg'));
         patch(svg, () => {
           elementVoid('rect');
         });

         const el = assertElement(svg.querySelector('rect'));
         expect(el.namespaceURI).to.equal('http://www.w3.org/2000/svg');
       });
  });

  describe('for math elements', () => {
    beforeEach(() => {
      patch(container, () => {
        elementOpen('math');
          elementOpen('semantics');
            elementOpen('mrow');
              elementVoid('mo');
            elementClose('mrow');
          elementClose('semantics');
        elementClose('math');
        elementVoid('p');
      });
    });

    it('should create equations in the MathML namespace', () => {
      const el = assertElement(container.querySelector('math'));
      expect(el.namespaceURI).to.equal('http://www.w3.org/1998/Math/MathML');
    });

    it('should create descendants of math in the MathML namespace', () => {
      const el = assertElement(container.querySelector('mo'));
      expect(el.namespaceURI).to.equal('http://www.w3.org/1998/Math/MathML');
    });

    it('should reset to the previous namespace after exiting math',
       () => {
         const el = assertElement(container.querySelector('p'));
         expect(el.namespaceURI).to.equal('http://www.w3.org/1999/xhtml');
       });

    it('should create children in the MathML namespace when patching an equation',
       () => {
         const mrow = assertElement(container.querySelector('mrow'));
         patch(mrow, () => {
           elementVoid('mi');
         });

         const el = assertElement(mrow.querySelector('mi'));
         expect(el.namespaceURI).to.equal('http://www.w3.org/1998/Math/MathML');
       });
  });
});
