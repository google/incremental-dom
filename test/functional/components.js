var IncrementalDOM = require('../../index'),
    patch = IncrementalDOM.patch,
    ve_component = IncrementalDOM.ve_component,
    ve_open = IncrementalDOM.ve_open,
    ve_close = IncrementalDOM.ve_close,
    vt = IncrementalDOM.vt,
    addShouldUpdateHook = IncrementalDOM.addShouldUpdateHook,
    removeShouldUpdateHook = IncrementalDOM.removeShouldUpdateHook;

describe('components', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('rendering children', () => {
    var createRenderer = function(su) {
      var rc = function(a) {
        ve_open('div', '', ['id', 'child']);
          vt(a.data.text);
        ve_close('div');
      };
      var statics = ['shouldUpdate', su, 'renderChildren', rc];

      return function(data) {
        ve_component('div', '', statics, 'data', data);
      };
    };

    it('should always render children on the first pass', () => {
      var render = createRenderer((p, n) => false);

      patch(container, () => render({ text: 'foo' }));
      var child = document.getElementById('child');

      expect(child).to.not.be.null;
      expect(child.textContent).to.equal('foo');
    });

    it('should always update if no shouldRender function', () => {
      var render = createRenderer();

      patch(container, () => render({ text: 'foo' }));
      patch(container, () => render({ text: 'bar' }));
      var child = document.getElementById('child');

      expect(child.textContent).to.equal('bar');
    });

    it('should not update if shouldRender returns false', () => {
      var render = createRenderer((p, n) => false);

      patch(container, () => render({ text: 'foo' }));
      patch(container, () => render({ text: 'bar' }));
      var child = document.getElementById('child');

      expect(child.textContent).to.equal('foo');
    });

    it('should update if shouldRender returns true', () => {
      var render = createRenderer((p, n) => true);

      patch(container, () => render({ text: 'foo' }));
      patch(container, () => render({ text: 'bar' }));
      var child = document.getElementById('child');

      expect(child.textContent).to.equal('bar');
    });

    it('should provide new and old attributes shouldRender', () => {
      var render = createRenderer((p, n) => p.data.text === 'foo' && n.data.text === 'bar');

      patch(container, () => render({ text: 'foo' }));
      patch(container, () => render({ text: 'bar' }));
      var child = document.getElementById('child');

      expect(child.textContent).to.equal('bar');
    });
  });

  describe('shouldUpdate hook', () => {
    var createRenderer = () => {
      var rc = function(a) {
        ve_open('div', '', ['id', 'child']);
          vt(a.data.text);
        ve_close('div');
      };

      return function(data) {
        ve_component('div', '', [ 'magicAttr', '', 'renderChildren', rc ], 'data', data);
      };
    };

    it('should prevent update when it returns false', () => {
      var render = createRenderer();
      addShouldUpdateHook('magicAttr', () => false);

      patch(container, () => render({ text: 'foo' }));
      patch(container, () => render({ text: 'bar' }));
      var child = document.getElementById('child');

      expect(child.textContent).to.equal('foo');
      
      removeShouldUpdateHook('magicAttr');
    });

    it('should allow update when it returns true', () => {
      var render = createRenderer();
      addShouldUpdateHook('magicAttr', () => true);

      patch(container, () => render({ text: 'foo' }));
      patch(container, () => render({ text: 'bar' }));
      var child = document.getElementById('child');

      expect(child.textContent).to.equal('bar');
      
      removeShouldUpdateHook('magicAttr');
    });
  });
});

