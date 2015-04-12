var IncrementalDOM = require('../../index'),
    patch = IncrementalDOM.patch,
    ve_open = IncrementalDOM.ve_open,
    ve_close = IncrementalDOM.ve_close,
    ve_void = IncrementalDOM.ve_void;

describe('created elements', function() {
  var container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(function() {
    document.body.removeChild(container);
  });

  describe('creating a single node', function() {
    var el;

    beforeEach(function() {
      patch(container, function() {
        ve_void('div', '', ['id', 'someId', 'class', 'someClass', 'data-custom', 'custom'],
                'data-foo', 'Hello',
                'data-bar', 'World');
      });

      el = container.childNodes[0];
    });

    it('should render with the specified tag', function() {
      expect(el.tagName).to.equal('DIV');
    });

    it('should render with static attributes', function() {
      expect(el.id).to.equal('someId');
      expect(el.className).to.equal('someClass');
      expect(el.getAttribute('data-custom')).to.equal('custom');
    });

    it('should render with dynamic attributes', function() {
      expect(el.getAttribute('data-foo')).to.equal('Hello');
      expect(el.getAttribute('data-bar')).to.equal('World');
    });
  });

  it('should allow creation without static attributes', function() {
    patch(container, function() {
      ve_void('div', '', null,
              'id', 'test');
    });
    var el = container.childNodes[0];
    expect(el.id).to.equal('test');
  });
});

