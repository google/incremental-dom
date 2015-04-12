var IncrementalDOM = require('../../index'),
    patch = IncrementalDOM.patch,
    vt = IncrementalDOM.vt;

describe('text nodes', function() {
  var container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(function() {
    document.body.removeChild(container);
  });

  describe('creating a text nodes', function() {
    it('should render a text node with the specified value', function() {
      patch(container, function() {
        vt('Hello world!');
      });
      var node = container.childNodes[0];

      expect(node.textContent).to.equal('Hello world!');
      expect(node).to.be.instanceof(Text);
    });

    it('should allow creation of multiple text nodes under one element', function() {
      patch(container, function() {
        vt('Hello ');
        vt('World');
        vt('!');
      });

      expect(container.textContent).to.equal('Hello World!');
    });
  });

  describe('conditional text', function() {
    function render(text) {
      vt(text);
    }

    it('should update the DOM when the text is updated', function() {
      patch(container, () => render('Hello'));
      patch(container, () => render('Hello World!'));
      var node = container.childNodes[0];

      expect(node.textContent).to.equal('Hello World!');
    });
  });
});

