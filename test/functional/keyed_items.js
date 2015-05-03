var IncrementalDOM = require('../../index'),
    patch = IncrementalDOM.patch,
    ve_void = IncrementalDOM.ve_void;

describe('rendering with keys', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('for an array of items', () => {
    function render(items) {
      for(var i=0; i<items.length; i++) {
        ve_void('div', items[i].key, [ 'id', items[i].key ]);
      }
    }

    it('should not modify the DOM nodes when inserting', () => {
      var items = [
        { key: 'one' },
        { key: 'two' }
      ];

      patch(container, () => render(items));
      var firstNode = container.childNodes[0];
      var secondNode = container.childNodes[1];

      items.splice(1, 0, { key: 'one-point-five' });
      patch(container, () => render(items));

      expect(container.childNodes.length).to.equal(3);
      expect(container.childNodes[0]).to.equal(firstNode);
      expect(container.childNodes[0].id).to.equal('one');
      expect(container.childNodes[1].id).to.equal('one-point-five');
      expect(container.childNodes[2]).to.equal(secondNode);
      expect(container.childNodes[2].id).to.equal('two');
    });

    it('should not modify the DOM nodes when removing', () => {
      var items = [
        { key: 'one' },
        { key: 'two' },
        { key: 'three' }
      ];

      patch(container, () => render(items));
      var firstNode = container.childNodes[0];
      var thirdNode = container.childNodes[2];

      items.splice(1, 1);
      patch(container, () => render(items));

      expect(container.childNodes.length).to.equal(2);
      expect(container.childNodes[0]).to.equal(firstNode);
      expect(container.childNodes[0].id).to.equal('one');
      expect(container.childNodes[1]).to.equal(thirdNode);
      expect(container.childNodes[1].id).to.equal('three');
    });

    it('should not modify the DOM nodes when re-ordering', () => {
      var items = [
        { key: 'one' },
        { key: 'two' },
        { key: 'three' }
      ];

      patch(container, () => render(items));
      var firstNode = container.childNodes[0];
      var secondNode = container.childNodes[1];
      var thirdNode = container.childNodes[2];

      items.splice(1, 1);
      items.push({ key: 'two' });
      patch(container, () => render(items));

      expect(container.childNodes.length).to.equal(3);
      expect(container.childNodes[0]).to.equal(firstNode);
      expect(container.childNodes[0].id).to.equal('one');
      expect(container.childNodes[1]).to.equal(thirdNode);
      expect(container.childNodes[1].id).to.equal('three');
      expect(container.childNodes[2]).to.equal(secondNode);
      expect(container.childNodes[2].id).to.equal('two');
    });
  });
});

