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

// taze: mocha from //third_party/javascript/typings/mocha
// taze: chai from //third_party/javascript/typings/chai
import {elementVoid, patch} from '../../index';
const {expect} = chai;

describe('style updates', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  function browserSupportsCssCustomProperties() {
    const style = document.createElement('div').style;
    style.setProperty('--prop', 'value');
    return style.getPropertyValue('--prop') === 'value';
  }

  function render(style) {
    elementVoid('div', null, null, 'style', style);
  }

  it('should render with the correct style properties for objects', () => {
    patch(container, () => render({color: 'white', backgroundColor: 'red'}));
    const el = container.childNodes[0];

    expect(el.style.color).to.equal('white');
    expect(el.style.backgroundColor).to.equal('red');
  });

  if (browserSupportsCssCustomProperties()) {
    it('should apply custom properties', () => {
      patch(container, () => render({'--some-var': 'blue'}));
      const el = container.childNodes[0];

      expect(el.style.getPropertyValue('--some-var')).to.equal('blue');
    });
  }

  it('should handle dashes in property names', () => {
    patch(container, () => render({'background-color': 'red'}));
    const el = container.childNodes[0];

    expect(el.style.backgroundColor).to.equal('red');
  });

  it('should update the correct style properties', () => {
    patch(container, () => render({color: 'white'}));
    patch(container, () => render({color: 'red'}));
    const el = container.childNodes[0];

    expect(el.style.color).to.equal('red');
  });

  it('should remove properties not present in the new object', () => {
    patch(container, () => render({color: 'white'}));
    patch(container, () => render({backgroundColor: 'red'}));
    const el = container.childNodes[0];

    expect(el.style.color).to.equal('');
    expect(el.style.backgroundColor).to.equal('red');
  });

  it('should render with the correct style properties for strings', () => {
    patch(container, () => render('color: white; background-color: red;'));
    const el = container.childNodes[0];

    expect(el.style.color).to.equal('white');
    expect(el.style.backgroundColor).to.equal('red');
  });
});
