let buf;

function patch(el, fn, data) {
  buf = '';
  fn(data);
  el.innerHTML = buf;
}

const EMPTY_ARRAY = [];

const escapeHtml = (function() {
  const cache = {};
  const textNode = document.createTextNode('');
  const div = document.createElement('div');
  div.appendChild(textNode);

  function escape(str) {
    textNode.data = str;
    return div.innerHTML;
  }

  return function(str) {
    return cache[str] || (cache[str] = escape(str));
  }
})();

function applyAttr(name, value) {
  if (value !== undefined) {
    buf += ' ' + name + '="' + value + '"';
  }
}

function applyAttrEscaped(name, value) {
  if (typeof value === 'string') {
    applyAttr(name, escapeHtml(value));
  } else {
    applyAttr(name, value);
  }
}

function elementOpen(tagName, key, statics) {
  let arr;
  let i;

  buf += '<' + tagName;

  arr = statics || EMPTY_ARRAY;
  for (i = 0; i < arr.length; i += 2) {
    applyAttrEscaped(arr[i], arr[i + 1]);
  }
  
  arr = arguments;
  for (i = 3; i < arr.length; i += 2) {
    applyAttrEscaped(arr[i], arr[i + 1]);
  }

  buf += '>';
}

function elementClose(tagName) {
  buf += '</' + tagName + '>';
}

function elementVoid (tagName, key, statics) {
  elementOpen.apply(null, arguments);
  elementClose.apply(null, arguments);
}

function text(value) {
  let formatted = value;
  for (let i = 1; i < arguments.length; i += 1) {
    let formatter = arguments[i];
    formatted = formatter(formatted);
  }

  buf += escapeHtml(formatted);
}

export const CreationInnerHtml = {
  patch,
  elementOpen,
  elementClose,
  elementVoid,
  text,
};
