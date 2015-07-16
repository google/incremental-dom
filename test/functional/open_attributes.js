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

var IncrementalDOM = require('../../index'),
    patch = IncrementalDOM.patch,
    elementOpen = IncrementalDOM.elementOpen,
    elementClose = IncrementalDOM.elementClose,
    elementVoid = IncrementalDOM.elementVoid;

describe('attribute updates', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('for regular attributes', () => {
    var el;

    function render(value) {
      el = elementOpen('div', '', [], 'data-expanded', value);
      elementClose('div');
    }

    it('should be present when they have a value', () => {
      patch(container, render, 'hello');

      expect(el.getAttribute('data-expanded')).to.equal('hello');
    });

    it('should be present when falsy', () => {
      patch(container, render, false);

      expect(el.getAttribute('data-expanded')).to.equal('false');
    });

    it('should be not present when undefined', () => {
      patch(container, render, undefined);

      expect(el.getAttribute('data-expanded')).to.equal(null);
    });

    it('should update the DOM when they change', () => {
      patch(container, render, 'foo');
      patch(container, render, 'bar');

      expect(el.getAttribute('data-expanded')).to.equal('bar');
    });

    it('should be removed when set to undefined', () => {
      patch(container, render, 'foo');
      patch(container, render, undefined);

      expect(el.getAttribute('data-expanded')).to.equal(null);
    });

    it('should update attributes in shuffled positions', () => {
      var renderAttr = (attrs) => {
        el = elementOpen('div', '', [], attrs.key, attrs.value);
        elementClose('div');
      };

      patch(container, renderAttr, {
        key: 'data-foo',
        value: 'foo'
      });
      patch(container, renderAttr, {
        key: 'data-bar',
        value: 'foo'
      });

      expect(el.getAttribute('data-bar')).to.equal('foo');
      expect(el.getAttribute('data-foo')).to.equal(null);
    });

    it('should remove trailing attributes when missing', function() {
      patch(container, render, 'foo');
      patch(container, () => {
        el = elementVoid('div', '', []);
      });

      expect(el.getAttribute('data-expanded')).to.equal(null);
    });
  });

  describe('for function attributes', () => {
    it('should not be set as attributes', () => {
      var fn = () =>{};
      patch(container, () => {
        elementVoid('div', '', null,
            'fn', fn);
      });
      var el = container.childNodes[0];

      expect(el.hasAttribute('fn')).to.be.false;
    });

    it('should be set on the node', () => {
      var fn = () =>{};
      patch(container, () => {
        elementVoid('div', '', null,
            'fn', fn);
      });
      var el = container.childNodes[0];

      expect(el.fn).to.equal(fn);
    });
  });

  describe('for object attributes', () => {
    it('should not be set as attributes', () => {
      var obj = {};
      patch(container, () => {
        elementVoid('div', '', null,
            'obj', obj);
      });
      var el = container.childNodes[0];

      expect(el.hasAttribute('obj')).to.be.false;
    });

    it('should be set on the node', () => {
      var obj = {};
      patch(container, () => {
        elementVoid('div', '', null,
            'obj', obj);
      });
      var el = container.childNodes[0];

      expect(el.obj).to.equal(obj);
    });
  });

  describe('for style', () => {
    function render(style) {
      elementVoid('div', '', [],
          'style', style);
    }

    it('should render with the correct style properties for objects', () => {
      patch(container, () => render({
        color: 'white',
        backgroundColor: 'red'
      }));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('white');
      expect(el.style.backgroundColor).to.equal('red');
    });

    it('should update the correct style properties', () => {
      patch(container, () => render({
        color: 'white'
      }));
      patch(container, () => render({
        color: 'red'
      }));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('red');
    });

    it('should remove properties not present in the new object', () => {
      patch(container, () => render({
        color: 'white'
      }));
      patch(container, () => render({
        backgroundColor: 'red'
      }));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('');
      expect(el.style.backgroundColor).to.equal('red');
    });

    it('should render with the correct style properties for strings', () => {
      patch(container, () => render('color: white; background-color: red;'));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('white');
      expect(el.style.backgroundColor).to.equal('red');
    });

    it('should render with the correct style properties for String instances', () => {
      patch(container, () => render(new String('color: white; background-color: red;')));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('white');
      expect(el.style.backgroundColor).to.equal('red');
    });
  });

  describe('for svg elements', () => {
    it('should correctly apply the class attribute', function() {
      patch(container, () => {
        elementVoid('svg', null, null,
            'class', 'foo');
      });
      var el = container.childNodes[0];

      expect(el.getAttribute('class')).to.equal('foo');
    });


  });
});

