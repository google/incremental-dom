var defineComponent = (function() {
  var patch = IncrementalDOM.patch;

  var shadowRoot = Symbol('shadowRoot');
  var firstUpdate = Symbol('firstUpdate');
  var props = Symbol('props');
  var render = Symbol('render');

  var Component = function() {};
  Component.prototype = Object.create(HTMLElement.prototype);
  Component.prototype.constructor = Component;


  Component.prototype.createdCallback = function() {
    // Create a shadow root for the content of the component to render into
    this[shadowRoot] = this.createShadowRoot();
    this[firstUpdate] = true;
    this[props] = null;

    // Handle lazy upgrade - take the existing props from the Element and
    // re-apply them so that they go through (and do not shadow) the setter.
    var props = this.props;
    if (props) {
      delete this.props;
      this.props = props;
    }
  };


  /**
   * Renders / diffs the contents of the component's shadow root using the
   * render function defined by the component's spec.
   */
  Component.prototype[render] = function() {
    patch(this[shadowRoot], this.render.bind(this));
  };    


  Component.prototype.willReceiveProps = function() {};
  Component.prototype.componentDidUpdate = function() {};
  Component.prototype.shouldComponentUpdate = function() {
    return true;
  };

  /**
   * Incremental DOM will update the 'props' property on the DOM node for our
   * component. This setter notifies us when the props have changed so that
   * we can check if an update is needed, and if so, call render. 
   * 
   */
  Object.defineProperty(Component.prototype, 'props', {
    set: function(newProps) {
      this.willReceiveProps(newProps, this.props);

      var shouldUpdate = this[firstUpdate] || 
                         this.shouldComponentUpdate(newProps, this.props);

      this[firstUpdate] = false;
      this[props] = newProps;

      if (shouldUpdate) {
        this[render]();
        this.componentDidUpdate();
      }
    },

    get: function() {
      return this[props];
    }
  });


  /**
   * Define a component with a React-like lifecycle. Spec is an object
   * containing.
   * - render (required)
   * - shouldComponentUpdate
   * - willReceiveProps
   * - componentDidUpdate
   * - attachedCallback
   * - detachedCallback
   * 
   * The attachedCallback / detachedCallback are the native custom element
   * lifecycle callbacks, corresponding to componentWillMount and
   * componentWillUnmount in React.
   */
  function defineComponent(spec) {
    var prototype = Object.create(Component.prototype);
    
    for(var name in spec) {
      prototype[name] = spec[name];
    }

    return document.registerElement(spec.tag, {
      prototype: prototype
    });
  };

  return defineComponent;
})();
