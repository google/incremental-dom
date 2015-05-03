var IncrementalDOM = require('../../index'),
    patch = IncrementalDOM.patch,
    vt = IncrementalDOM.vt;

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
        vt('Hello world!');
      });
      var node = container.childNodes[0];

      expect(node.textContent).to.equal('Hello world!');
      expect(node).to.be.instanceof(Text);
    });

    it('should allow for multiple text nodes under one parent element', () => {
      patch(container, () => {
        vt('Hello ');
        vt('World');
        vt('!');
      });

      expect(container.textContent).to.equal('Hello World!');
    });
  });

  describe('with conditional text', () => {
    function render(text) {
      vt(text);
    }

    it('should update the DOM when the text is updated', () => {
      patch(container, () => render('Hello'));
      patch(container, () => render('Hello World!'));
      var node = container.childNodes[0];

      expect(node.textContent).to.equal('Hello World!');
    });
  });
});

