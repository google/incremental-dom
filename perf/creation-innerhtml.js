(function(scope) {
  var buf;

  function patch(el, fn, data) {
    buf = '';
    fn(data);
    el.innerHTML = buf;
  }

  var EMPTY_ARRAY = [];

  var escapeHtml = (function() {
    var cache = {};
    var textNode = document.createTextNode('');
    var div = document.createElement('div');
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
    var arr;
    var i;

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
    var formatted = value;
    for (var i = 1; i < arguments.length; i += 1) {
      var formatter = arguments[i];
      formatted = formatter(formatted);
    }

    buf += escapeHtml(formatted);
  }

  scope.CreationInnerHtml = {
    patch: patch,
    elementOpen: elementOpen,
    elementClose: elementClose,
    elementVoid: elementVoid,
    text: text
  };
})(window);
