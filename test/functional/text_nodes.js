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
  text
} from '../../index';


describe('text nodes', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('when created', () => {
    it('should render a text node with the specified value', () => {
      patch(container, () => {
        text('Hello world!');
      });
      var node = container.childNodes[0];

      expect(node.textContent).to.equal('Hello world!');
      expect(node).to.be.instanceof(Text);
    });

    it('should allow for multiple text nodes under one parent element', () => {
      patch(container, () => {
        text('Hello ');
        text('World');
        text('!');
      });

      expect(container.textContent).to.equal('Hello World!');
    });
  });

  describe('with conditional text', () => {
    function render(data) {
      text(data);
    }

    it('should update the DOM when the text is updated', () => {
      patch(container, () => render('Hello'));
      patch(container, () => render('Hello World!'));
      var node = container.childNodes[0];

      expect(node.textContent).to.equal('Hello World!');
    });
  });
});

