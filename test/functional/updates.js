/**
 * Copyright 2017 The Incremental DOM Authors. All Rights Reserved.
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
  applyUpdates,
  bufferAttribute,
  bufferProperty
} from '../../index.js';

describe('updates', () => {
  let container;

  function render({attributes, properties} = {}) {
    open('div');
      for (const key in properties) {
        bufferProperty(key, properties[key]);
      }
      for (const key in attributes) {
        bufferAttribute(key, attributes[key]);
      }
      applyUpdates();
    close('div');
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should add new attributes', () => {
    patch(container, () => render({
      attributes: {
        'data-expanded': 'hello'
      }
    }));
    const el = container.childNodes[0];

    expect(el.getAttribute('data-expanded')).to.equal('hello');
  });

  it('should remove attributes', () => {
    patch(container, () => render({
      attributes: {
        'data-expanded': 'hello'
      }
    }));
    patch(container, () => render());
    const el = container.childNodes[0];

    expect(el.hasAttribute('data-expanded')).to.be.false;
  });

  it('should add new properties', () => {
    patch(container, () => render({
      properties: {
        'prop': 'hello'
      }
    }));
    const el = container.childNodes[0];

    expect(el.prop).to.equal('hello');
  });

  it('should remove properties', () => {
    patch(container, () => render({
      properties: {
        'prop': 'hello'
      }
    }));
    patch(container, () => render());
    const el = container.childNodes[0];

    expect(el.prop).to.be.undefined;
  });

  it('should add both attributes and properties', () => {
    patch(container, () => render({
      attributes: {
        'data-expanded': 'hello'
      },
      properties: {
        'prop': 'hello'
      }
    }));
    const el = container.childNodes[0];

    expect(el.getAttribute('data-expanded')).to.equal('hello');
    expect(el.prop).to.equal('hello');
  });
});

