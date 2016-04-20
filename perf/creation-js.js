(function(scope) {
  var currentParent;

  function patch(el, fn, data) {
    el.innerHTML = '';
    currentParent = el;
    fn(data);
  }

  var EMPTY_ARRAY = [];

  function applyAttr(el, name, value) {
    if (value !== undefined) {
      el.setAttribute(name, value);
    }
  }

  function elementOpen(tagName, key, statics) {
    var el = document.createElement(tagName);
    var arr;
    var i;

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
    var formatted = value;
    for (var i = 1; i < arguments.length; i += 1) {
      var formatter = arguments[i];
      formatted = formatter(formatted);
    }

    var node = document.createTextNode(formatted);
    currentParent.appendChild(node);
  }

  scope.CreationJs = {
    patch: patch,
    elementOpen: elementOpen,
    elementClose: elementClose,
    elementVoid: elementVoid,
    text: text
  };
})(window);
