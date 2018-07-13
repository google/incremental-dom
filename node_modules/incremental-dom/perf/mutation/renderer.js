const listStatics = [
  'id', 'list',
];
const itemStatics = [
  'class', 'item',
  'tabindex', '-1',
];
const nameStatics = [
  'class', 'item-name'
];
const valueStatics = [
  'class', 'item-value'
];
const changeStatics = [
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

export function MutationRenderer(container, lib) {
  const {
    patch,
    elementOpen,
    elementClose,
    text
  } = lib;

  function render(props) {
    const items = props.items;

    elementOpen('table', null, listStatics);

    for(let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const delta = item.value * item.change;

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
          elementOpen('strong'); 
            text(item.change, toPercent, toFixedTwo, wrapChange)
          elementClose('strong');
        elementClose('td');
      elementClose('tr');
    }
    
    elementClose('table'); 
  }

  this.render = function(props) {
    patch(container, render, props)
  };

  this.clear = function() {
    container.innerHTML = '';
  };
}