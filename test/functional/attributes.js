var IncrementalDOM = require('../../index'),
    patch = IncrementalDOM.patch,
    ve_void = IncrementalDOM.ve_void;

describe('attribute updates', function() {
  var container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(function() {
    document.body.removeChild(container);
  });

  describe('conditional attribute', function() {
    function render(obj) {
      ve_void('div', '', [],
              'data-expanded', obj.key);
    }

    it('should be present when it has a value', function() {
      patch(container, () => render({
        key: 'hello'
      }));
      var el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('hello');
    });

    it('should be present when falsy', function() {
      patch(container, () => render({
        key: false
      }));
      var el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('false');
    });

    it('should be not present when undefined', function() {
      patch(container, () => render({
        key: undefined
      }));
      var el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal(null);
    });

    it('should update the DOM when they change', function() {
      patch(container, () => render({
        key: true
      }));
      patch(container, () => render({
        key: false
      }));
      var el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('false');
    });
  });

  describe('function attributes', function() {
    it('should not be be set on the node', function() {
      patch(container, () => {
        ve_void('div', '', null,
                'fn', () => {});
      });
      var el = container.childNodes[0];

      expect(el.hasAttribute('fn')).to.be.false;
    });
  });

  describe('object attributes', function() {
    it('should not be be set on the node', function() {
      patch(container, () => {
        ve_void('div', '', null,
                'obj', {});
      });
      var el = container.childNodes[0];

      expect(el.hasAttribute('obj')).to.be.false;
    });
  });

  describe('style', function() {
    function render(style) {
      ve_void('div', '', [],
              'style', style);
    }

    it('should render with the correct style properties for objects', function() {
      patch(container, () => render({
        color: 'white',
        backgroundColor: 'red'
      }));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('white');
      expect(el.style.backgroundColor).to.equal('red');
    });

    it('should update the correct style properties', function() {
      patch(container, () => render({
        color: 'white'
      }));
      patch(container, () => render({
        color: 'red'
      }));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('red');
    });

    it('should remove properties not present in the new object', function() {
      patch(container, () => render({
        color: 'white'
      }));
      patch(container, () => render({
        backgroundColor: 'red'
      }));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('');
      expect(el.style.backgroundColor).to.equal('red');
    });

    it('should render with the correct style properties for strings', function() {
      patch(container, () => render('color: white; background-color: red;'));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('white');
      expect(el.style.backgroundColor).to.equal('red');
    });

    it('should render with the correct style properties for String instances', function() {
      patch(container, () => render(new String('color: white; background-color: red;')));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('white');
      expect(el.style.backgroundColor).to.equal('red');
    });
  });
});

