const listStatics = [
  'id', 'list',
  'role', 'list',
];
const itemStatics = [
  'class', 'message',
  'role', 'listitem',
  'tabindex', '-1',
];
const checkboxStatics = [
 'class', 'checkbox',
 'role', 'checkbox',
 'tabindex', '-1'
];
const starStatics = [
  'class', 'star'
];
const senderStatics = [
  'class', 'sender'
];
const subjectStatics = [
  'class', 'subject'
];

export function ListRenderer(container, lib) {
  const {
    patch,
    elementVoid,
    elementOpen,
    elementClose,
    text
  } = lib;

  function render(props) {
    const items = props.items;
    const selectedKeys = props.selectedKeys;

    elementOpen('ul', null, listStatics);

    for(let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const isSelected = selectedKeys[item.key];

      elementOpen('li', item.key, itemStatics,
            'aria-selected', isSelected);
      
        elementVoid('div', null, checkboxStatics,
            'aria-checked', 'false');

        elementVoid('button', null, starStatics,
            'data-starred', item.starred,
            'aria-label', item.starred ? 'Starred' : 'Not Starred');
        
        elementOpen('span', null, senderStatics,
            'title', item.sender);
          text(item.sender);
        elementClose('span');

        elementOpen('a', null, subjectStatics,
            'title', item.subject);
          text(item.subject);
        elementClose('a');

        elementOpen('span');
          text(item.date);
        elementClose('span');

      elementClose('li');
    }
    
    elementClose('ul'); 
  }

  this.render = function(props) {
    patch(container, render, props)
  };

  this.clear = function() {
    container.innerHTML = '';
  };
}