let currentParent;

function patch(el, fn, data) {
  el.innerHTML = '';
  currentParent = el;
  fn(data);
}

const EMPTY_ARRAY = [];

function applyAttr(el, name, value) {
  if (value !== undefined) {
    el.setAttribute(name, value);
  }
}

function elementOpen(tagName, key, statics) {
  const el = document.createElement(tagName);
  let arr;
  let i;

  arr = statics || EMPTY_ARRAY;
  for (i = 0; i < arr.length; i += 2) {
    applyAttr(el, arr[i], arr[i + 1]);
  }

  arr = arguments;
  for (i = 3; i < arr.length; i += 2) {
    applyAttr(el, arr[i], arr[i + 1]);
  }

  currentParent.appendChild(el);
  currentParent = el;
}

function elementClose(tagName) {
  currentParent = currentParent.parentNode;
}

function elementVoid(tagName, key, statics) {
  elementOpen.apply(null, arguments);
  elementClose.apply(null, arguments);
}

function text(value) {
  let formatted = value;
  for (let i = 1; i < arguments.length; i += 1) {
    const formatter = arguments[i];
    formatted = formatter(formatted);
  }

  const node = document.createTextNode(formatted);
  currentParent.appendChild(node);
}

export const CreationJs = {
  patch,
  elementOpen,
  elementClose,
  elementVoid,
  text,
};
