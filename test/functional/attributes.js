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
  elementOpen,
  elementOpenStart,
  elementOpenEnd,
  attr,
  elementClose,
  elementVoid,
  importNode
} from '../../index.js';

describe('attribute updates', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('for conditional attributes', () => {
    function render(attrs) {
      elementOpenStart('div');
      for (const attrName in attrs) {
        attr(attrName, attrs[attrName]);
      }
      elementOpenEnd();
      elementClose('div');
    }

    it('should be present when they have a value', () => {
      patch(container, () => render({
        'data-expanded': 'hello'
      }));
      const el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('hello');
    });

    it('should be present when falsy', () => {
      patch(container, () => render({
        'data-expanded': false
      }));
      const el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('false');
    });

    it('should be not present when undefined', () => {
      patch(container, () => render({
        id: undefined,
        tabindex: undefined,
        'data-expanded': undefined
      }));
      const el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal(null);
      expect(el.getAttribute('id')).to.equal(null);
      expect(el.getAttribute('tabindex')).to.equal(null);
    });

    it('should update the DOM when they change', () => {
      patch(container, () => render({
        'data-expanded': 'foo'
      }));
      patch(container, () => render({
        'data-expanded': 'bar'
      }));
      const el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('bar');
    });

    it('should update different attribute in same position', () => {
      patch(container, () => render({
        'data-foo': 'foo'
      }));
      patch(container, () => render({
        'data-bar': 'foo'
      }));
      const el = container.childNodes[0];

      expect(el.getAttribute('data-bar')).to.equal('foo');
      expect(el.getAttribute('data-foo')).to.equal(null);
    });

    describe('for attributes in different position', () => {
      it('should keep attribute that is moved up', () => {
        patch(container, () => render({
          'data-foo': 'foo',
          'data-bar': 'bar'
        }));
        patch(container, () => render({
          'data-bar': 'bar'
        }));
        const el = container.childNodes[0];

        expect(el.getAttribute('data-foo')).to.equal(null);
        expect(el.getAttribute('data-bar')).to.equal('bar');
      });


      it('should keep attribute that is moved back', () => {
        patch(container, () => render({
          'data-bar': 'bar'
        }));
        patch(container, () => render({
          'data-foo': 'foo',
          'data-bar': 'bar'
        }));
        const el = container.childNodes[0];

        expect(el.getAttribute('data-foo')).to.equal('foo');
        expect(el.getAttribute('data-bar')).to.equal('bar');
      });

      it('should keep attribute that is moved up then kept', () => {
        patch(container, () => render({
          'data-foo': 'foo',
          'data-bar': 'bar',
          'data-baz': 'baz'
        }));
        patch(container, () => render({
          'data-bar': 'bar',
          'data-baz': 'baz'
        }));
        const el = container.childNodes[0];

        expect(el.getAttribute('data-foo')).to.equal(null);
        expect(el.getAttribute('data-bar')).to.equal('bar');
        expect(el.getAttribute('data-baz')).to.equal('baz');

        patch(container, () => render({
          'data-bar': 'bar'
        }));
        expect(el.getAttribute('data-foo')).to.equal(null);
        expect(el.getAttribute('data-bar')).to.equal('bar');
        expect(el.getAttribute('data-baz')).to.equal(null);
      });

      it('should keep attribute that is backwards up then kept', () => {
        patch(container, () => render({
          'data-bar': 'bar',
          'data-baz': 'baz'
        }));
        patch(container, () => render({
          'data-foo': 'foo',
          'data-bar': 'bar',
          'data-baz': 'baz'
        }));
        const el = container.childNodes[0];

        expect(el.getAttribute('data-foo')).to.equal('foo');
        expect(el.getAttribute('data-bar')).to.equal('bar');
        expect(el.getAttribute('data-baz')).to.equal('baz');

        patch(container, () => render({
          'data-foo': 'foo',
          'data-bar': 'bar'
        }));
        expect(el.getAttribute('data-foo')).to.equal('foo');
        expect(el.getAttribute('data-bar')).to.equal('bar');
        expect(el.getAttribute('data-baz')).to.equal(null);
      });
    });

    it('should remove trailing attributes when missing', function() {
      patch(container, () => render({
        'data-foo': 'foo',
        'data-bar': 'bar'
      }));
      patch(container, () => render({}));
      const el = container.childNodes[0];

      expect(el.getAttribute('data-foo')).to.equal(null);
      expect(el.getAttribute('data-bar')).to.equal(null);
    });
  });

  describe('for function attributes', () => {
    it('should not be set as attributes', () => {
      const fn = () =>{};
      patch(container, () => {
        elementVoid('div', null, null,
            'fn', fn);
      });
      const el = container.childNodes[0];

      expect(el.hasAttribute('fn')).to.be.false;
    });

    it('should be set on the node', () => {
      const fn = () =>{};
      patch(container, () => {
        elementVoid('div', null, null,
            'fn', fn);
      });
      const el = container.childNodes[0];

      expect(el.fn).to.equal(fn);
    });
  });

  describe('for object attributes', () => {
    it('should not be set as attributes', () => {
      const obj = {};
      patch(container, () => {
        elementVoid('div', null, null,
            'obj', obj);
      });
      const el = container.childNodes[0];

      expect(el.hasAttribute('obj')).to.be.false;
    });

    it('should be set on the node', () => {
      const obj = {};
      patch(container, () => {
        elementVoid('div', null, null,
            'obj', obj);
      });
      const el = container.childNodes[0];

      expect(el.obj).to.equal(obj);
    });
  });

  describe('for svg elements', () => {
    it('should correctly apply the class attribute', function() {
      patch(container, () => {
        elementVoid('svg', null, null,
            'class', 'foo');
      });
      const el = container.childNodes[0];

      expect(el.getAttribute('class')).to.equal('foo');
    });

    it('should apply the correct namespace for namespaced SVG attributes', () => {
      patch(container, () => {
        elementOpen('svg');
        elementVoid('image', null, null,
            'xlink:href', '#foo');
        elementClose('svg');
      });
      const el = container.childNodes[0].childNodes[0];
      expect(el.getAttributeNS('http://www.w3.org/1999/xlink', 'href')).to.equal('#foo');
    });

    it('should remove namespaced SVG attributes', () => {
      patch(container, () => {
        elementOpen('svg');
        elementVoid('image', null, null,
            'xlink:href', '#foo');
        elementClose('svg');
      });
      patch(container, () => {
        elementOpen('svg');
        elementVoid('image', null, null);
        elementClose('svg');
      });
      const el = container.childNodes[0].childNodes[0];
      expect(el.hasAttributeNS('http://www.w3.org/1999/xlink', 'href')).to.be.false;
    });
  });

  describe('for non-Incremental DOM attributes', () => {
    function render() {
      elementVoid('div');
    }

    it('should be preserved when changed between patches', () => {
      patch(container, render);
      const el = container.firstChild;
      el.setAttribute('data-foo', 'bar');
      patch(container, render);

      expect(el.getAttribute('data-foo')).to.equal('bar');
    });

    it('should be preserved when importing DOM', () => {
      container.innerHTML = '<div></div>';

      importNode(container);
      const el = container.firstChild;
      el.setAttribute('data-foo', 'bar');
      patch(container, render);

      expect(el.getAttribute('data-foo')).to.equal('bar');
    });
  });

  describe('with an existing document tree', () => {
    let div;

    beforeEach(function() {
      div = document.createElement('div');
      div.setAttribute('tabindex', '-1');
      container.appendChild(div);
    });

    it('should update attributes', () => {
      function render() {
        elementVoid('div', null, null,
            'tabindex', '0');
      }

      patch(container, render);
      const child = container.childNodes[0];

      expect(child.getAttribute('tabindex')).to.equal('0');
    });

    it('should remove attributes', () => {
      function render(data) {
        elementVoid('div', null, null,
            data.attr, 'bar');
      }
      patch(container, render, { attr: 'data-foo' });
      const child = container.childNodes[0];

      expect(child.hasAttribute('tabindex')).to.false;
      expect(child.getAttribute('data-foo')).to.equal('bar');

      patch(container, render, { attr: 'data-bar' });
      expect(child.hasAttribute('tabindex')).to.false;
      expect(child.hasAttribute('data-foo')).to.false;
      expect(child.getAttribute('data-bar')).to.equal('bar');
    });

    it('should persist statics', () => {
      function render(value) {
        elementVoid('div', null, ['data-foo', value]);
      }

      patch(container, render, 'bar');
      const child = container.childNodes[0];

      expect(child.getAttribute('data-foo')).to.equal('bar');

      patch(container, render, 'baz');
      expect(child.getAttribute('data-foo')).to.equal('bar');
    });

    it('should persist statics when patching a parent', () => {
      function renderParent(value) {
        elementOpen('div')
        render(value);
        elementClose('div');
      }
      function render(value) {
        elementVoid('div', null, ['data-foo', value]);
      }

      const child = container.childNodes[0];
      patch(child, render, 'bar');
      const grandChild = child.childNodes[0];

      expect(grandChild.getAttribute('data-foo')).to.equal('bar');

      patch(container, renderParent, 'baz');

      expect(child.hasAttribute('tabindex')).to.false;
      expect(grandChild.getAttribute('data-foo')).to.equal('bar');
    });

  });
});

