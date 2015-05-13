var IncrementalDOM = require('../../index'),
    patch = IncrementalDOM.patch,
    ie_open = IncrementalDOM.ie_open,
    ie_close = IncrementalDOM.ie_close,
    ie_void = IncrementalDOM.ie_void;

describe('element creation', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('when creating a single node', () => {
    var el;

    beforeEach(() => {
      patch(container, () => {
        ie_void('div', '', ['id', 'someId', 'class', 'someClass', 'data-custom', 'custom'],
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
      ie_void('div', '', null,
              'id', 'test');
    });
    var el = container.childNodes[0];
    expect(el.id).to.equal('test');
  });
});

