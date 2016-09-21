(function(scope) {

var listStatics = [
  'id', 'list',
  'role', 'list',
];
var itemStatics = [
  'class', 'message',
  'role', 'listitem',
  'tabindex', '-1',
];
var checkboxStatics = [
 'class', 'checkbox',
 'role', 'checkbox',
 'tabindex', '-1'
];
var starStatics = [
  'class', 'star'
];
var senderStatics = [
  'class', 'sender'
];
var subjectStatics = [
  'class', 'subject'
];

function ListRenderer(container, lib) {
  var patch = lib.patch,
      elementVoid = lib.elementVoid,
      elementOpen = lib.elementOpen,
      elementClose = lib.elementClose,
      text = lib.text;

  function render(props) {
    var items = props.items;
    var selectedKeys = props.selectedKeys;

    elementOpen('ul', null, listStatics);

    for(var i = 0; i < items.length; i += 1) {
      var item = items[i];
      var isSelected = selectedKeys[item.key];

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
    lib.patch(container, render, props)
  };

  this.clear = function() {
    container.innerHTML = '';
  };
}

scope.ListRenderer = ListRenderer;

}(window));
