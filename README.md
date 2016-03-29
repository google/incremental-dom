[![Build Status](https://travis-ci.org/google/incremental-dom.svg?branch=master)](https://travis-ci.org/google/incremental-dom) 

# Incremental DOM

## Overview

Incremental DOM is a library for building up DOM trees and updating them in-place when data changes. It differs from the established virtual DOM approach in that no intermediate tree is created (the existing tree is mutated in-place). This approach significantly reduces memory allocation and GC thrashing for incremental updates to the DOM tree therefore increasing performance significantly in some cases.

Incremental DOM is primarily intended as a compilation target for templating languages. It could be used to implement a higher level API for human consumption. The API was carefully designed to minimize heap allocations and where unavoidable ensure that as many objects as possible can be de-allocated by incremental GC. One unique feature of its API is that it separates opening and closing of tags so that it is suitable as a compilation target for templating languages that allow (temporarily) unbalanced HTML in templates (e.g. tags that are opened and closed in separate templates) and arbitrary logic for creating HTML attributes.
*Think of it as ASM.dom.*

## Supported Browsers

Incremental DOM supports IE9 and above.

## Usage

HTML is expressed in Incremental DOM using the `elementOpen`, `elementClose`, `elementVoid` and `text` methods. Consider the following example:

```javascript
var IncrementalDOM = require('incremental-dom'),
    elementOpen = IncrementalDOM.elementOpen,
    elementClose = IncrementalDOM.elementClose,
    elementVoid = IncrementalDOM.elementVoid,
    text = IncrementalDOM.text;

function render(data) {
  elementVoid('input', '', [ 'type', 'text' ]);
  elementOpen('div', '', null);
    if (data.someCondition) {
      text(data.text);
    }
  elementClose('div');
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

## Templating Languages and Libraries

[Check out](ECOSYSTEM.md)  what others having been doing with Incremental DOM.

## Docs

- [Introducing Incremental Dom](https://medium.com/google-developers/introducing-incremental-dom-e98f79ce2c5f)
- [Docs and demos](http://google.github.io/incremental-dom/)

### Installation

```sh
npm install incremental-dom
```

## Development

To install the required development packages, run the following command:

```sh
npm i
```

### Running tests

To run once:

```sh
gulp unit
```

To run on change:

```sh
gulp unit-watch
```

### Building

To build once:

```sh
gulp js
```

To build on change:

```sh
gulp js-watch
```
