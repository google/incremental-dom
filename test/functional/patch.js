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
    ie_open = IncrementalDOM.ie_open,
    ie_close = IncrementalDOM.ie_close,
    ie_void = IncrementalDOM.ie_void,
    itext = IncrementalDOM.itext;

describe('patching an element', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('with an existing document tree', () => {
    var div;

    function render() {
      ie_void('div', null, null,
              'tabindex', '0');
    }

    beforeEach(function() {
      div = document.createElement('div');
      div.setAttribute('tabindex', '-1');
      container.appendChild(div);
    });

    it('should preserve existing nodes', () => {
      patch(container, render);
      var child = container.childNodes[0];

      expect(child).to.equal(div);
    });

    it('should update attributes', () => {
      patch(container, render);
      var child = container.childNodes[0];

      expect(child.getAttribute('tabindex')).to.equal('0');
    });
  });

  it('should be re-entrant', function() {
    var containerOne = document.createElement('div');
    var containerTwo = document.createElement('div');

    function renderOne() {
      ie_open('div');
        patch(containerTwo, renderTwo);
        itext('hello');
      ie_close('div');
    }

    function renderTwo() {
      itext('foobar');
    }

    patch(containerOne, renderOne);

    expect(containerOne.textContent).to.equal('hello');
    expect(containerTwo.textContent).to.equal('foobar');
  });
});

