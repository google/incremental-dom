var IncrementalDOM = require('../../index'),
    patch = IncrementalDOM.patch,
    ve_open = IncrementalDOM.ve_open,
    ve_close = IncrementalDOM.ve_close,
    ve_void = IncrementalDOM.ve_void;

describe('created elements', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('creating a single node', () => {
    var el;

    beforeEach(() => {
      patch(container, () => {
        ve_void('div', '', ['id', 'someId', 'class', 'someClass', 'data-custom', 'custom'],
                'data-foo', 'Hello',
                'data-bar', 'World');
      });

      el = container.childNodes[0];
    });

    it('should render with the specified tag', () => {
      expect(el.tagName).to.equal('DIV');
    });

    it('should render with static attributes', () => {
      expect(el.id).to.equal('someId');
      expect(el.className).to.equal('someClass');
      expect(el.getAttribute('data-custom')).to.equal('custom');
    });

    it('should render with dynamic attributes', () => {
      expect(el.getAttribute('data-foo')).to.equal('Hello');
      expect(el.getAttribute('data-bar')).to.equal('World');
    });
  });

  it('should allow creation without static attributes', () => {
    patch(container, () => {
      ve_void('div', '', null,
              'id', 'test');
    });
    var el = container.childNodes[0];
    expect(el.id).to.equal('test');
  });
});

