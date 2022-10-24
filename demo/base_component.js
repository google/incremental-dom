const patch = IncrementalDOM.patch;

const firstUpdate = Symbol('firstUpdate');
const props = Symbol('props');
const render = Symbol('render');

export class BaseComponent extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root for the content of the component to render into
    this.attachShadow({mode: 'open'});
    this[firstUpdate] = true;
    this[props] = null;

    // Handle lazy upgrade - take the existing props from the Element and
    // re-apply them so that they go through (and do not shadow) the setter.
    var props = this.props;
    if (props) {
      delete this.props;
      this.props = props;
    }
  }

  /**
   * Renders / diffs the contents of the component's shadow root using the
   * render function defined by the component's spec.
   */
  [render]() {
    patch(this.shadowRoot, this.render.bind(this));
  }

  willReceiveProps() {}
  componentDidUpdate() {}
  shouldComponentUpdate() {
    return true;
  }

  /**
   * Incremental DOM will update the 'props' property on the DOM node for our
   * component. This setter notifies us when the props have changed so that
   * we can check if an update is needed, and if so, call render. 
   */
  set props(newProps) {
    this.willReceiveProps(newProps, this.props);

    var shouldUpdate = this[firstUpdate] || 
                       this.shouldComponentUpdate(newProps, this.props);

    this[firstUpdate] = false;
    this[props] = newProps;

    if (shouldUpdate) {
      this[render]();
      this.componentDidUpdate();
    }
  }

  get props() {
    return this[props];
  }
}
