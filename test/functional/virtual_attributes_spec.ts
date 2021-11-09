//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

 // taze: chai from //third_party/javascript/typings/chai
import {attr, elementClose, elementOpen, elementOpenEnd, elementOpenStart, patch} from '../../index';
const {expect} = chai;

describe('virtual attribute updates', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('for conditional attributes', () => {
    function render(obj) {
      elementOpenStart('div');
      if (obj.key) {
        attr('data-expanded', obj.key);
      }
      elementOpenEnd();
      elementClose('div');
    }

    it('should be present when specified', () => {
      patch(container, () => render({key: 'hello'}));
      const el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('hello');
    });

    it('should be not present when not specified', () => {
      patch(container, () => render({key: false}));
      const el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal(null);
    });

    it('should update the DOM when they change', () => {
      patch(container, () => render({key: 'foo'}));
      patch(container, () => render({key: 'bar'}));
      const el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('bar');
    });

    it('should correctly apply attributes during nested patches', () => {
      const otherContainer = document.createElement('div');

      patch(container, () => {
        elementOpenStart('div');
        attr('parrentAttrOne', 'pOne');

        patch(otherContainer, () => {
          elementOpenStart('div');
          attr('childAttrOne', 'cOne');
          elementOpenEnd();
          elementClose('div');
        });

        attr('parrentAttrTwo', 'pTwo');
        elementOpenEnd();

        elementClose('div');
      });

      const parentAttributes = container.children[0].attributes;
      expect(parentAttributes).to.have.length(2);
      expect(parentAttributes['parrentAttrOne'].value).to.equal('pOne');
      expect(parentAttributes['parrentAttrTwo'].value).to.equal('pTwo');
      const childAttributes = otherContainer.children[0].attributes;
      expect(childAttributes).to.have.length(1);
      expect(childAttributes['childAttrOne'].value).to.equal('cOne');
    });
  });

  it('should throw when a virtual attributes element is unclosed', () => {
    expect(() => {
      patch(container, () => {
        elementOpenStart('div');
      });
    })
        .to.throw(
            'elementOpenEnd() must be called after calling' +
            ' elementOpenStart().');
  });

  it(`should throw when virtual attributes element is
        closed without being opened`,
     () => {
       expect(() => {
         patch(container, () => {
           elementOpenEnd();
         });
       })
           .to.throw(
               'elementOpenEnd() can only be called' +
               ' after calling elementOpenStart().');
     });

  it('should throw when opening an element inside a virtual attributes element',
     () => {
       expect(() => {
         patch(container, () => {
           elementOpenStart('div');
           elementOpen('div');
         });
       })
           .to.throw(
               'elementOpen() can not be called between' +
               ' elementOpenStart() and elementOpenEnd().');
     });

  it('should throw when opening a virtual attributes element' +
         ' inside a virtual attributes element',
     () => {
       expect(() => {
         patch(container, () => {
           elementOpenStart('div');
           elementOpenStart('div');
         });
       })
           .to.throw(
               'elementOpenStart() can not be called between' +
               ' elementOpenStart() and elementOpenEnd().');
     });

  it('should throw when closing an element inside a virtual attributes element',
     () => {
       expect(() => {
         patch(container, () => {
           elementOpenStart('div');
           elementClose('div');
         });
       })
           .to.throw(
               'elementClose() can not be called between' +
               ' elementOpenStart() and elementOpenEnd().');
     });
});
