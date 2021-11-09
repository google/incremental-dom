//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

// taze: mocha from //third_party/javascript/typings/mocha
// taze: chai from //third_party/javascript/typings/chai

import {alignWithDOM, elementClose, elementOpen, elementVoid, patch, skip, text, skipNode} from '../../index';
const {expect} = chai;

describe('skip', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  function render(data) {
    elementOpen('div');
    if (data.skip) {
      skip();
    } else {
      text('some ');
      text('text');
    }
    elementClose('div');
  }

  it('should keep any DOM nodes in the subtree', () => {
    patch(container, render, {skip: false});
    patch(container, render, {skip: true});

    expect(container.textContent).to.equal('some text');
  });

  it('should throw if an element is declared after skipping', () => {
    expect(() => {
      patch(container, () => {
        skip();
        elementOpen('div');
        elementClose('div');
      });
    })
        .to.throw(
            'elementOpen() may not be called inside an element' +
            ' that has called skip().');
  });

  it('should throw if a text is declared after skipping', () => {
    expect(() => {
      patch(container, () => {
        skip();
        text('text');
      });
    })
        .to.throw(
            'text() may not be called inside an element that has called skip().');
  });

  it('should throw skip is called after declaring an element', () => {
    expect(() => {
      patch(container, () => {
        elementVoid('div');
        skip();
      });
    })
        .to.throw(
            'skip() must come before any child declarations inside' +
            ' the current element.');
  });

  it('should throw skip is called after declaring a text', () => {
    expect(() => {
      patch(container, () => {
        text('text');
        skip();
      });
    })
        .to.throw(
            'skip() must come before any child declarations' +
            ' inside the current element.');
  });
});

describe('alignWithDOM', () => {
  let container:HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  function render(condition: boolean, shouldSkip: boolean) {
    if (condition) {
      elementVoid('img');
    }
    if (shouldSkip) {
      alignWithDOM('div', 1);
    } else {
      elementOpen('div', 1);
        text('Hello');
      elementClose('div');
    }
  }
  it('should skip the correct element when used with conditional elements', () => {
    patch(container, () => {
      render(true, false);
    });
    expect(container.children[1]!.innerHTML).to.equal('Hello');
    container.children[1]!.innerHTML = 'Hola';
    patch(container, () => {
      render(false, true);
    });
    expect(container.childElementCount).to.equal(1);
    // When condition is false, the current node will be at <img>
    // alignWithDOM will then pull the second <div> up to the
    // current position and diff it. The <img> will then be deleted.
    expect(container.children[0]!.innerHTML).to.equal('Hola');
  });
});