var IncrementalDOM = require('../../index'),
    patch = IncrementalDOM.patch,
    ve_open_start = IncrementalDOM.ve_open_start,
    ve_open_end = IncrementalDOM.ve_open_end,
    ve_close = IncrementalDOM.ve_close,
    va = IncrementalDOM.va;

describe('virtual attribute updates', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('for conditional attributes', () => {
    function render(obj) {  
      ve_open_start('div', '', []);
        if (obj.key) {
          va('data-expanded', obj.key);
        }
      ve_open_end();
      ve_close('div');
    }

    it('should be present when specified', () => {
      patch(container, () => render({
        key: 'hello'
      }));
      var el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('hello');
    });

    it('should be not present when not specified', () => {
      patch(container, () => render({
        key: false
      }));
      var el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal(null);
    });

    it('should update the DOM when they change', () => {
      patch(container, () => render({
        key: 'foo'
      }));
      patch(container, () => render({
        key: 'bar'
      }));
      var el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('bar');
    });
  });

});

