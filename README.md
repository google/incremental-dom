# Incremental DOM

## Overview

Incremental DOM is a library for building up DOM trees and update them in-place when data changes. It differs from the established virtual DOM approach in that no intermediate tree is created (the existing tree is mutated in-place). This significantly reduces memory allocation for incremental updates to the DOM tree and thus increases performance significantly in some cases.

Incremental DOM is primarily intended as a compilation target for templating languages or it could be used to implement a higher level API for human consumption. The API was carefully designed to minimize heap allocations and where unavoidable ensure that as many objects a possible can be de-allocated by incremental GC. One unique feature of its API that separates opening and closing of tags so that it is suitable as a compilation target for templating languages that allow (temporarily) unbalanced HTML in templates (e.g. tags that are opened and closed in separate templates) and arbitrary logic for creating HTML attributes.
*Think of it as ASM.dom.*

## Usage

HTML is expressed in Incremental DOM using the ie_open, ie_close, ie_void and itext methods. Consider the following example:

```javascript
var IncrementalDOM = require('incremental-dom'),
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
var patch = require('incremental-dom').patch;

var data = {
  text: 'Hello World!',
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

### Installation

`npm install incremental-dom`

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
