(function(scope) {

var listStatics = [
  'id', 'list',
];
var itemStatics = [
  'class', 'item',
  'tabindex', '-1',
];
var nameStatics = [
  'class', 'item-name'
];
var valueStatics = [
  'class', 'item-value'
];
var changeStatics = [
  'class', 'item-change'
];

function wrapChange(value) {
  return ' (' + value + ')%';
}

function toFixedTwo(value) {
  return value.toFixed(2);
}

function toPercent(value) {
  return value * 100;
}

function MutationRenderer(container, lib) {
  var patch = lib.patch,
      elementVoid = lib.elementVoid,
      elementOpen = lib.elementOpen,
      elementClose = lib.elementClose,
      text = lib.text;

  function render(props) {
    var items = props.items;
    var selectedKeys = props.selectedKeys;

    elementOpen('table', null, listStatics);

    for(var i = 0; i < items.length; i += 1) {
      var item = items[i];
      var delta = item.value * item.change;

      elementOpen('tr', item.key, itemStatics);
        elementOpen('td', null, nameStatics);
          elementOpen('a', null, null,
              'href', item.name);
            text(item.name);
          elementClose('a');
        elementClose('td');
        elementOpen('td', null, valueStatics);
          text(item.value, toFixedTwo);
        elementClose('td');
        elementOpen('td', null, changeStatics,
            'data-positive', item.change >= 0);
          text(delta, toFixedTwo);
          text(item.change, toPercent, toFixedTwo, wrapChange)
        elementClose('td');
      elementClose('tr');
    }
    
    elementClose('table'); 
  }

  this.render = function(props) {
    lib.patch(container, render, props)
  };

  this.clear = function() {
    container.innerHTML = '';
  };
}

scope.MutationRenderer = MutationRenderer;

}(window));
