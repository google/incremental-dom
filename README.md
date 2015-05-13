# iDOM

## Overview

iDOM is a library for declaring DOM trees that are updated in-place when data changes. This differs from virtual DOM based libraries in that an intermediate tree is not created. It is primarily intended as a compilation target of a templating language, such as [Closure Templates](https://developers.google.com/closure/templates/)

## Usage

HTML is expressed in iDOM using the ie_open, ie_close, ie_void and itext methods. Consider the following example:

```javascript
var idom = require('idom'),
    ie_open = idom.ie_open,
    ie_close = idom.ie_close,
    ie_void = idom.ie_void,
    itext = idom.itext;

function render(data) {
  ie_void('input', '', [ 'type', 'text' ]);
  ie_open('div', '', null);
    if (data.someCondition) {
      itext(data.text);
    }
  ie_close('div');
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
