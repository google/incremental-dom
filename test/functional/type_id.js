/**
 * Copyright 2016 The Incremental DOM Authors. All Rights Reserved.
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
  open,
  close,
  elementVoid
} from '../../index';

describe('typeId', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  function render(tag, key, typeId) {
    open(tag, key, typeId);
    close(tag);
  }

  it('should re-use matching types', () => {
    patch(container, () => render('div', null, 1));
    const div = container.firstChild;
    patch(container, () => render('div', null, 1));

    expect(container.firstChild).to.equal(div);
  });

  it('should not re-use non-matching types', () => {
    patch(container, () => render('div', null, 1));
    const div = container.firstChild;
    patch(container, () => render('div', null, 2));

    expect(container.firstChild).to.not.equal(div);
  });

  it('should not re-use non-matching tags', () => {
    patch(container, () => render('div', null, 1));
    const div = container.firstChild;
    patch(container, () => render('span', null, 1));

    expect(container.firstChild).to.not.equal(div);
  });

  it('should allow multiple elements with the same type', () => {
    patch(container, () => {
      open('div', null, 1);
      close();
      open('div', null, 1);
      close();
    });

    expect(container.children).to.have.length(2);
  });

  it('should pass typeId through virtual elements', () => {
    patch(container, () => render('div', null, 1));
    const div = container.firstChild;

    patch(container, () => {
      elementVoid('div', null, null, 'attr', 'value', 1);
    });
    expect(container.firstChild).to.equal(div);
    expect(div.getAttribute('attr')).to.equal('value');

    patch(container, () => {
      elementVoid('div', null, null, 'attr', 'value', 2);
    });
    expect(container.firstChild).to.not.equal(div);
  });
});

