[![Build Status](https://travis-ci.org/google/incremental-dom.svg?branch=master)](https://travis-ci.org/google/incremental-dom) 

# Incremental DOM

## Overview

Incremental DOM is a library for building up DOM trees and updating them in-place when data changes. It differs from the established virtual DOM approach in that no intermediate tree is created (the existing tree is mutated in-place). This approach significantly reduces memory allocation and GC thrashing for incremental updates to the DOM tree therefore increasing performance significantly in some cases.

Incremental DOM is primarily intended as a compilation target for templating languages. It could be used to implement a higher level API for human consumption. The API was carefully designed to minimize heap allocations and where unavoidable ensure that as many objects as possible can be de-allocated by incremental GC. One unique feature of its API is that it separates opening and closing of tags so that it is suitable as a compilation target for templating languages that allow (temporarily) unbalanced HTML in templates (e.g. tags that are opened and closed in separate templates) and arbitrary logic for creating HTML attributes.
*Think of it as ASM.dom.*

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

## Templating Languages

### Closure Compiler Templates

We are building a new JavaScript backend for the
[Closure Templates](https://developers.google.com/closure/templates/) templating
language. Follow along on [Github](https://github.com/google/closure-templates/).

```
{template .helloWorld}
  <h1>Hello World!</h1>
{/template}
```

### JSX

You can also use React's [JSX syntax](https://facebook.github.io/jsx/) using this
[Babel plugin](https://github.com/babel-plugins/babel-plugin-incremental-dom).

```js
function render() {
  return <h1>Hello World</h1>
}
```

### superviews.js

[superviews.js](https://github.com/davidjamesstone/superviews.js) is a template language that closely maps to the incremental-dom API.

```html
<p if="showMe" class="{=cssClass}">
  <span style="{ color: foo, width: bar }">{name}</span>
</p>
```

### starplate

[starplate](https://github.com/littlstar/starplate) is a fast template and view engine built on top of the incremental-dom API. It makes use of ES6 template strings for interpolation, [parse5](https://github.com/inikulin/parse5) for DOM travserval, and incremental-dom for DOM patches.

Consider the following rudimentary example for rendering and updating a clock.

```js
import {View} from 'starplate';
const clock = new View('<section>Time <span class="time">${time}</span></section>')
clock.render(document.body);
setInterval(_ => clock.update({time: Date()}, 1000);
```

### Create your own

If you work on a templating language we'd love to see Incremental DOM adopted as
an alternative backend for it. This isn’t easy, we are still working on ours and
will for a while, but we're super happy to help with it.

Here's an [example](https://gist.github.com/sparhami/197f3b947712998639eb).

## Docs

- [Introducing Incremental Dom](https://medium.com/google-developers/introducing-incremental-dom-e98f79ce2c5f)
- [Docs and demos](http://google.github.io/incremental-dom/)

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
