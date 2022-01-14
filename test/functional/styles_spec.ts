//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

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
