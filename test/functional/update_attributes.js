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
    elementVoid = IncrementalDOM.elementVoid,
    updateAttributes = IncrementalDOM.updateAttributes;

describe('attribute updates', () => {
  var container;
  var el;

  function render() {
    el = elementVoid('div', '', ['data-expanded', 'true'], 'data-foo', 'foo');
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    patch(container, render);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should add attributes', () => {
    updateAttributes(el, 'data-bar', 'bar')

    expect(el.getAttribute('data-bar')).to.equal('bar');
  });

  it('should update static attributes', () => {
    updateAttributes(el, 'data-expanded', 'bar')

    expect(el.getAttribute('data-expanded')).to.equal('bar');
  });

  it('should update dynamic attributes', () => {
    updateAttributes(el, 'data-foo', 'bar')

    expect(el.getAttribute('data-foo')).to.equal('bar');
  });

  it('should remove attributes when undefined', () => {
    updateAttributes(el, 'data-foo', undefined);

    expect(el.getAttribute('data-foo')).to.equal(null);
  });

});

