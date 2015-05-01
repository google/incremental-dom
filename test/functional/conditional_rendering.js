var IncrementalDOM = require('../../index'),
    patch = IncrementalDOM.patch,
    ve_open = IncrementalDOM.ve_open,
    ve_close = IncrementalDOM.ve_close,
    ve_void = IncrementalDOM.ve_void;

describe('conditional rendering', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('nodes', () => {
    function render(condition) {
      ve_open('div', '', ['id', 'outer']);
        ve_void('div', '', ['id', 'one' ]);

        if (condition) {
          ve_void('div', '', ['id', 'conditional-one' ]);
          ve_void('div', '', ['id', 'conditional-two' ]);
        }

        ve_void('span', '', ['id', 'two' ]);
      ve_close();
    }

    it('should un-render when the condition becomes false', () => {
      patch(container, () => render(true));
      patch(container, () => render(false));
      var outer = container.childNodes[0];

      expect(outer.childNodes.length).to.equal(2);
      expect(outer.childNodes[0].id).to.equal('one');
      expect(outer.childNodes[0].tagName).to.equal('DIV');
      expect(outer.childNodes[1].id).to.equal('two');
      expect(outer.childNodes[1].tagName).to.equal('SPAN');
    });

    it('should render when the condition becomes true', () => {
      patch(container, () => render(false));
      patch(container, () => render(true));
      var outer = container.childNodes[0];

      expect(outer.childNodes.length).to.equal(4);
      expect(outer.childNodes[0].id).to.equal('one');
      expect(outer.childNodes[0].tagName).to.equal('DIV');
      expect(outer.childNodes[1].id).to.equal('conditional-one');
      expect(outer.childNodes[1].tagName).to.equal('DIV');
      expect(outer.childNodes[2].id).to.equal('conditional-two');
      expect(outer.childNodes[2].tagName).to.equal('DIV');
      expect(outer.childNodes[3].id).to.equal('two');
      expect(outer.childNodes[3].tagName).to.equal('SPAN');
    });
  });

  describe('with only conditional childNodes', () => {
    function render(condition) {
      ve_open('div', '', ['id', 'outer']);

        if (condition) {
          ve_void('div', '', ['id', 'conditional-one' ]);
          ve_void('div', '', ['id', 'conditional-two' ]);
        }

      ve_close();
    }

    it('should not leave any remaning nodes', () => {
      patch(container, () => render(true));
      patch(container, () => render(false));
      var outer = container.childNodes[0];

      expect(outer.childNodes.length).to.equal(0);
    });
  });

  describe('nodes', () => {
    function render(condition) {
      ve_open('div', '', [],
              'id', 'outer');
        ve_void('div', '', [],
                'id', 'one' );

        if (condition) {
          ve_open('span', '', [],
                  'id', 'conditional-one');
            ve_void('span', '', []);
          ve_close();
        }

        ve_void('span', '', [],
                'id', 'two');
      ve_close();
    }

    it('should strip children when a conflicting node is re-used', () => {
      patch(container, () => render(true));
      patch(container, () => render(false));
      var outer = container.childNodes[0];

      expect(outer.childNodes.length).to.equal(2);
      expect(outer.childNodes[0].id).to.equal('one');
      expect(outer.childNodes[0].tagName).to.equal('DIV');
      expect(outer.childNodes[1].id).to.equal('two');
      expect(outer.childNodes[1].tagName).to.equal('SPAN');
      expect(outer.childNodes[1].children.length).to.equal(0);
    });
  });
});

