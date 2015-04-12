# iDOM

## Overview

iDOM is a library for declaring DOM trees that are updated in-place when data changes. This differs from virtual DOM based libraries in that an intermediate tree is not created. It is primarily intended as a compilation target of a templating language, such as [Closure Templates](https://developers.google.com/closure/templates/)

## Usage

HTML is expressed in iDOM using the ve_open, ve_close, ve_void and vt methods. Consider the following example:

```javascript
var idom = require('idom'),
    ve_open = idom.ve_open,
    ve_close = idom.ve_close,
    ve_void = idom.ve_void;

function render(data) {
  ve_void('input', '', [ 'type', 'text' ]);
  ve_open('div', '', null);
    if (data.someCondition) {
      vt(data.text);
    }
  ve_close('div');
}
```

To render or update an existing DOM node, the patch function is used:


```javascript
var patch = require('idom').patch;

var data = {
  text: 'Hello Wrld!',
  someCondition: true
};

patch(myElement, function() {
  render(data);
});

data.text = 'Hello World!';

patch(myElement, function() {
  render(data);
});
```

## Development

To install the required development packages, run the following command:

`npm i`

### Running tests

To run once:

`gulp unit`

To run on change:

`gulp unit-watch`

### Building

To build once:

`gulp js`

To build on change:

`gulp js-watch`
