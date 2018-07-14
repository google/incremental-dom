// Based on https://github.com/joshwcomeau/react-flip-move/blob/master/src/FlipMove.js
const {
  elementOpen,
  elementClose,
  currentElement,
} = IncrementalDOM;

const locations = new WeakMap();
const initializedEls = new WeakSet();

function updateOffset(node) {
  const rect = node.getBoundingClientRect();
  const lastLocation = locations.get(node);
  const newLocation = {
    top: rect.top
  };

  locations.set(node, newLocation);

  if (!lastLocation) {
    return;
  }

  const deltaY = lastLocation.top - newLocation.top;
  node.style.transitionDuration = '0ms';
  node.style.transform = `translate(0, ${deltaY}px)`;
}

function triggerAnimation(nodes) {
  requestAnimationFrame(_ => {
    requestAnimationFrame(_ => {
      nodes.forEach(node => {
        node.style.transitionDuration = '';
        node.style.transform = '';
      });
    });
  });
}

function attachList(el) {
  if (initializedEls.has(el)) {
    return;
  }

  new MutationObserver(_ => {
    const children = [...el.childNodes];
    children.forEach(updateOffset);
    triggerAnimation(children);
  }).observe(el, {childList: true});

  initializedEls.add(el);
}

export function reorderList(fn) {
  // Treating element as a component, so it should have a custom tag so
  // that the mutation observer we create is never reused with a different
  // logical element.
  elementOpen('x-reorderlist');
    attachList(currentElement());
    fn();
  elementClose('x-reorderlist');
};
