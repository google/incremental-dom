---
---

[Source](https://github.com/google/incremental-dom)

* TOC
{:toc}

## About

Incremental DOM is a library for expressing and applying updates to DOM trees. JavaScript can be used to extract, iterate over and transform data into calls generating `HTMLElement`s and `Text` nodes. It differs from Virtual DOM approaches in that a diff operation is performed *incrementally* (that is one node at a time) against the DOM, rather than on a virtual DOM tree.

Rather than targeting direct usage, Incremental DOM aims to provide a platform for higher level libraries or frameworks. As you might notice from the examples, Incremental DOM-style markup can be somewhat challenging to write and read. See [Why Incremental DOM](#why-incremental-dom) for an explanation.

## Installation

See [our Github](https://github.com/google/incremental-dom).

## Rendering DOM

The DOM to be rendered is described with the incremental node functions, [`elementOpen`](#elementopen), [`elementClose`](#elementclose) and [`text`](#text). For example, the following function:

```javascript
function renderPart() {
  elementOpen('div');
    text('Hello world');
  elementClose('div');
}
```

would correspond to

```html
<div>
  Hello world
</div>
```

Using the `renderPart` function from above, the <a href="#patch">`patch`</a> function can be used to render the desired structure into an existing <a href="https://developer.mozilla.org/en-US/docs/Web/API/element">`Element`</a> or <a href="https://developer.mozilla.org/en-US/docs/Web/API/document">`Document`</a> (which includes Shadow DOM). Calling the patch function again will patch the DOM tree with any changes, updating attributes, and creating/removing DOM nodes as needed.

```javascript
patch(document.getElementById('someId'), renderPart);
```

### Attributes and Properties

In addition to creating DOM nodes, you can also add/update attributes and properties on Elements. They are specified as variable arguments, alternating between attribute/property name and value. Values that are Objects or Functions are set as properties, with all others being set as attributes.

<aside>
  <figure>
    <table>
      <thead>
        <tr>
          <th>typeof value</th>
          <th>Set as attribute</th>
          <th>Set as property</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>object</td><td></td><td>x</td></tr>
        <tr><td>function</td><td></td><td>x</td></tr>
        <tr><td>undefined</td><td>x</td><td></td></tr>
        <tr><td>boolean</td><td>x</td><td></td></tr>
        <tr><td>number</td><td>x</td><td></td></tr>
        <tr><td>string</td><td>x</td><td></td></tr>
      </tbody>
    </table>
    <figcaption>How values provided to elementOpen are set</figcaption>
  </figure>
</aside>

One use for setting a property could be to store callbacks for use with an event delegation library. Since you can assign to any property on the DOM node, you can even assign to on* handlers, like onclick. 

```javascript
elementOpen('div', null, null,
    'class', 'someClass',
    'onclick', someFunction);
  …
elementClose('div');
```

## Statics Array

Often times, you know that some properties on a DOM node will not change. One example would be the `type` attribute in `<input type="text">`. Incremental DOM provides a shortcut to avoid comparing attributes/properties you know will not change. The third argument to [`elementOpen`](#elementopen) is an array of unchanging attributes. To avoid allocating an array on each pass, you will want to declare the array in a scope that is only executed once. 


If the statics array is provided, you must also provide a key. This ensures that an Element with the same tag but different statics array is never re-used by Incremental DOM.

```javascript
function render() {
  const s1 = [ 'type', 'text', 'placeholder', '…'];

  return function(isDisabled) {
    elementOpen('input', '1', s1,
        'disabled', isDisabled);
    elementClose('input');
  };
}
```

### Applying Styles

Styles for an element can be set either using a string or an object. When setting styles using an object, the names should be camelCase as they are set on the Element's style property. 

#### As a string

```javascript
elementOpen('div', null, null,
    'style', 'color: white; background-color: red;');
      …
elementClose('div');
```
#### As an object


```javascript
elementOpen('div', null, null,
    'style', {
      color: 'white',
      backgroundColor: 'red'
    });
  …
elementClose('div');
```

## Conditional Rendering

### If/else

As you can mix node declarations and JavaScript, rendering conditional branches is fairly straightforward. Simply place the node declarations inside a branch. This works with switch statements too!

```javascript
function renderGreeting(date, name) {
  if (date.getHours() < 12) {
    elementOpen('strong');
    text('Good morning, ');
    elementClose('strong');
  } else {
    text('Hello ');
  }

  text(name);
}
```

### DOM Element Updates / Reuse

Incremental DOM compares the existing Element in the DOM with the one that is
specified by the current function call. If the tag matches, it is reused. For
example, given:

```javascript
if (condition) {
  elementOpen('div');
    // subtree 'A'
  elementClose('div');
}

elementOpen('div');
  // subtree 'B'
elementClose('div');
```

If `condition` goes from `false` to `true`, Incremental DOM will transform subtree
'B' into subree 'A'. Next, it will create a new `div` with subtree 'B'.

#### Keys

To prevent different logical subtrees being reused, you can give Incremental 
DOM an additional signal to help distinguish between the two.

This is done by passing "key" to the `elementOpen` function. This will be used
to:

1. Prevent the treating of newly added or moved items as a diff that needs to be reconciled.
1. Correctly maintain focus on any input fields, buttons or other items that may receive focus that have moved.

Keys do not need to be unique. One strategy might be to simply autogenerate a
key for every logical statement in the source.

#### Keys and Arrays

Arrays can be especially important when rendering arrays, especially if you plan on adding new items in the start/middle or moving items. As Incremental DOM does not know when you are rendering an array of items, there is no warning generated when a key should be specified but is not present. If you are compiling from a template or transpiling, it might be a good idea to statically check to make sure a key is specified.

```javascript
elementOpen('ul');
  items.forEach(function(item) {
    elementOpen('li', item.id);
      text(item.text);
    elementClose('li');
  });
elementClose('ul');
```

### Logic in Attributes

Incremental DOM provides some helpers to give some additional control over how attribures are specified. The [`elementOpenStart`](#elementopenstart), [`attr`](#attr) and [`elementOpenEnd`](#elementopenend) functions act as a helper for calling [`elementOpen`](#elementopen), allowing you to mix logic and attributes or call other functions.


```javascript
elementOpenStart('div');
  for (const key in obj) {
    attr(key, obj[key]);
  }
elementOpenEnd('div');
```

## Rendering HTML Blobs

Incremental DOM does not have a way of rendering blobs of HTML itself, but it can be implemented using the [`skip`](#skip) function. Depending on the complexity of what you need, a simple function like the following might suffice:

```javascript
function html(content) {
  const el = elementOpen('html-blob');
  if (el.__cachedInnerHtml !== content) {
    el.__cachedInnerHtml = content;
    el.innerHTML = content;
  }
  skip()
  elementClose('html-blob');
}
```

which could then be used as follows:

```javascript
elementOpen('div');
  text('Hello ');
  html('<em>world</em>');
elementClose('div');
```

You may want something more advanced for your html rendering function. For example, you may want to make sure that the content is safe to render if it originates from a user (e.g. if it contains an anchor tag, the `href `does not start with `javascript:`) or that it is only called with strings that have already be sanitized (either on the backend or frontend).

Additionally, you may want to diff the HTML content rather than simply overwriting the existing content with `innerHTML`.

## Passing Functions

The incremental node functions are evaluated when they are called. If you do not want to have them appear in the current location (e.g. to pass them to another function), simply wrap the statements in a function which can be called later.

```javascript
function renderStatement(content, isStrong) {
  if (isStrong) {
    elementOpen('strong');
     content();
    elementClose('strong');
  } else {
    content();
  }
}

function renderGreeting(name) {
  function content() {
    text('Hello ');
    text(name);
  }

  elementOpen('div');
    renderStatement(content, true);
  elementClose('div');
}
```

## Hooks

### Setting Values

Incremental DOM provides hooks to allow customization of how values are set. The `attributes` object allows you to provide a function to decide what to do when an attribute passed to `elementOpen` or similar functions changes. The following example makes Incremental DOM always set `value` as a property.

```javascript
import {
  attributes,
  applyProp,
  applyAttr
} from 'incremental-dom';

attributes.value = applyProp;
```

If you would like to have a bit more control over how the value is set, you can specify your own function for applying the update.

```javascript
attributes.value = function(element, name, value) {
  …
};
``` 

If no function is specified for a given name, a default function is used that applies values as described in [Attributes and Properties](#attributes-and-properties). This can be changed by specifying the function for `symbols.default`.
 
```javascript
import {
  attributes,
  symbols
} from 'incremental-dom';

attributes[symbols.default] = someFunction;
``` 

### Added/Removed Nodes

You can be notified when Nodes are added or removed by Incremental DOM by specifying functions for `notifications.nodesCreated` and `notifications.nodesDeleted`. If there are added or removed nodes during a patch operation, the appropriate function will be called at the end of the patch with the added or removed nodes.

```javascript
import { notifications } from 'incremental-dom';

notifications.nodesCreated = function(nodes) {
  nodes.forEach(function(node) {
    // node may be an Element or a Text
  });
};
``` 

## API

### elementOpen
<div class="api-fn" markdown="1">

#### Description

  Declares an Element with zero or more attributes/properties that should be present at the current location in the document tree.

#### Parameters

<dl>
  <dt><code><em>string</em> tagname</code></dt>
  <dd>The name of the tag, e.g. 'div' or 'span'. This could also be the tag of a custom element.</dd>
  <dt><code><em>string</em> key</code></dt>
  <dd>The key that identifies Element for reuse. See <a href="#keys-and-arrays">Keys and Arrays</a></dd>
  <dt><code><em>Array</em> staticPropertyValuePairs</code></dt>
  <dd>Pairs of property names and values. Depending on the type of the value, these will be set as either attributes or properties on the Element. These are only set on the Element once during creation. These will not be updated during subsequent passes. See <a href="#statics-array">Statics Array</a>.</dd>
  <dt><code><em>vargs</em> propertyValuePairs</code></dt>
  <dd>Pairs of property names and values. Depending on the type of the value, these will be set as either attributes or properties on the Element.</dd>
</dl>

#### Returns

`Element` The corresponding DOM Element.

#### Usage

```javascript
import { elementOpen } from 'incremental-dom';

function somefunction() { … };

…

elementOpen('div', item.key, ['staticAttr', 'staticValue'],
    'someAttr', 'someValue',
    'someFunctionAttr', somefunction);
```

</div>
### elementOpenStart
<div class="api-fn" markdown="1">

#### Description

Used with [`attr`](#attr) and [`elementOpenEnd`](#elementopenend) to declare an element.

#### Parameters

<dl>
  <dt><code><em>string</em> tagname</code></dt>
  <dd>The name of the tag, e.g. 'div' or 'span'. This could also be the tag of a custom element.</dd>
  <dt><code><em>string</em> key</code></dt>
  <dd>The key that identifies Element for reuse. See <a href="#keys-and-arrays">Keys and Arrays</a></dd>
  <dt><code><em>Array</em> staticPropertyValuePairs</code></dt>
  <dd>Pairs of property names and values. Depending on the type of the value, these will be set as either attributes or properties on the Element. These are only set on the Element once during creation. These will not be updated during subsequent passes. See <a href="#statics-array">Statics Array</a>.</dd>
</dl>

</div>
### attr
<div class="api-fn" markdown="1">

#### Description

Used with [`elementOpenStart`](#elementopenstart) and [`elementOpenEnd`](#elementopenend) to declare an element.

#### Parameters

<dl>
  <dt><code><em>string</em> name</code></dt>
  <dt><code><em>any</em> value</code></dt>
</dl>

</div>
### elementOpenEnd
<div class="api-fn" markdown="1">

#### Description

Used with [`elementOpenStart`](#elementopenstart) and [`attr`](#attr) to declare an element.

#### Returns

`Element` The corresponding DOM Element.

</div>
### elementClose
<div class="api-fn" markdown="1">

#### Description

Signifies the end of the element opened with [`elementOpen`](#elementopen), corresponding to a closing tag (e.g. `</div>` in HTML). Any childNodes of the currently open Element that are in the DOM that have not been encountered in the current render pass are removed by the call to `elementClose`.

#### Parameters

<dl>
  <dt><code><em>string</em> tagname</code></dt>
  <dd>The name of the tag, e.g. 'div' or 'span'. This could also be the tag of a custom element.</dd>
</dl>

#### Returns

`Element` The corresponding DOM Element.

#### Usage

```javascript
import { elementClose } from 'incremental-dom';

… 

elementClose('div');
```

</div>
### elementVoid
<div class="api-fn" markdown="1">

#### Description

A combination of [`elementOpen`](#elementopen), followed by [`elementClose`](#elementclose).

#### Parameters

<dl>
  <dt><code><em>string</em> tagname</code></dt>
  <dd>The name of the tag, e.g. 'div' or 'span'. This could also be the tag of a custom element.</dd>
  <dt><code><em>string</em> key</code></dt>
  <dd>The key that identifies Element for reuse. See <a href="#keys-and-arrays">Arrays of Items</a></dd>
  <dt><code><em>Array</em> staticPropertyValuePairs</code></dt>
  <dd>Pairs of property names and values. Depending on the type of the value, these will be set as either attributes or properties on the Element. These are only set on the Element once during creation. These will not be updated during subsequent passes. See <a href="#statics-array">Statics Array</a>.</dd>
  <dt><code><em>vargs</em> propertyValuePairs</code></dt>
  <dd>Pairs of property names and values. Depending on the type of the value, these will be set as either attributes or properties on the Element.</dd>
</dl>

#### Returns

`Element` The corresponding DOM Element.

#### Usage

```javascript
import { elementVoid } from 'incremental-dom';

…

elementVoid('div', item.key, ['staticAttr', 'staticValue'],
'someAttr', 'someValue',
'someFunctionAttr', somefunction);
```

</div>
### text
<div class="api-fn" markdown="1">

#### Description

Declares a `Text` node, with the specified text, should appear at the current location in the document tree.

#### Parameters

<dl>
  <dt><code><em>string|boolean|number</em> value</code></dt>
  <dd>The value for the Text node.</dd>
  <dt><code><em>...function</em> formatters</code></dt>
  <dd>Optional functions that format the value when it changes.</dd>
</dl>

#### Returns

`Text` The corresponding DOM Text Node.


#### Usage

```javascript
import { text } from 'incremental-dom';

function toUpperCase(str) {
  return str.toUpperCase();
}

…

text('hello world', toUpperCase);
```

</div>
### patch
<div class="api-fn" markdown="1">

#### Description

Updates the provided Node with a function containing zero or more calls to `elementOpen`, `text` and `elementClose`. The provided callback function may call other such functions. The patch function may be called with a new Node while a call to patch is already executing.

#### Parameters

<dl>
  <dt><code><em>Node</em> node</code></dt>
  <dd>The Node to patch. Typically, this will be an HTMLElement or DocumentFragment.</dd>
  <dt><code><em>function</em> description</code></dt>
  <dd>The description of the DOM tree underneath <code>node</code>.</dd>
  <dt><code><em>any</em> data</code></dt>
  <dd>Optional data that will be passed to <code>description</code>.</dd>
</dl>

#### Usage

```javascript
import { patch } from 'incremental-dom';

function render(data) {
  elementOpen('div');
  elementClose('div');
  …
}

const myElement = document.getElementById(…);
const someData = {…};
patch(myElement, render, someData);
```
</div>
### currentElement
<div class="api-fn" markdown="1">

#### Description

Provides a way to get the currently open element.

#### Returns

`Element` The currently open element.

#### Usage

```javascript
import { elementOpen, elementClose, currentElement } from 'incremental-dom';

…

const element = elementOpen('div');
console.log(element === currentElement()); // true
elementOpen('span');
console.log(element === currentElement()); // false
elementClose('span');
console.log(element === currentElement()); // true
elementClose('div');
```
### currentPointer
<div class="api-fn" markdown="1">

#### Description

The current location in the DOM that Incremental DOM is looking at. This will be the next `Node` that will be compared against for the next `elementOpen` or `text` call.

#### Returns

`Node` The next node that will be compared.

#### Usage

This can be used to look at the next `Node` to be diffed and perform some action (e.g. skip the node).

```javascript
import { elementOpen, currentPointer, skipNode } from 'incremental-dom';

function myElementOpen(...args) {
  // Skip over all nodes with _isExternal.
  let pointer;
  while (pointer = currentPointer() && pointer._isExternal) {
    skipNode();
  }
  elementOpen(...args);
}
```
### skip
<div class="api-fn" markdown="1">

#### Description

Moves the current pointer to the end of the currently open element. This prevents Incremental DOM from removing any children of the currently open element. When calling `skip`, there should be no calls to `elementOpen` (or similiar) prior to the `elementClose` call for the currently open element.

#### Usage

```javascript
import { patch, elementOpen, elementClose, skip } from 'incremental-dom';

function render(data) {
  const element = elementOpen('div');
  if (shouldUpdate(element._data, data)) {
    element._data = data;
    // Make calls to elementOpen, etc.
    …
  } else {
    skip();
  }
  elementClose('div');
}

const myElement = document.getElementById(…);
const someData = {…};
patch(myElement, render, someData);
```
</div>
### skipNode
<div class="api-fn" markdown="1">

#### Description

Moves the current patch pointer forward by one node. This can be used to skip over elements declared outside of Incremental DOM.
#### Usage

If you have a DOM structure like:

```html
<div id="one"><!-- managed by Incremental DOM --></div>
<div id="two"><!-- maintained externally --></div>
<div id="three"><!-- managed by Incremental DOM --></div>
```

You can skip over `<div id="two"></div>` as follows:

```javascript
import { elementVoid, skipNode } from 'incremental-dom';

function render() {
  elementVoid('div', null, null, 'id', 'one');
  skipNode();
  elementVoid('div', null, null, 'id', 'three');
}
```
</div>

## Demos

### Using Keys

The section on <a href="#keys-and-arrays">keys and arrays</a> mentions why using a key is important when iterating over an item. This demo shows how using a key prevents DOM nodes corresponding to separate items from being seen as a diff. In this case, a newly added item at the head of an array causes a new element by be created rather than all the items being updated.

<a href="./demo/keys.html">Demo</a>

### Using with Web Components

Incremental DOM itself only renders Elements and Text nodes, but you may want to use components when building an application. One way this chould be solved is by using the emerging <a href="http://w3c.github.io/webcomponents/spec/custom/">web components</a> standards. The following demo shows one way you could create components.

<a href="./demo/customelement.html">Demo</a>

### Animating When Reordering Items

Incremental DOM simply creates and moves DOM nodes. There are no hooks for telling when an item moves or having any input into the process. You can use [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to tell when things move and do fancy things like animate when items move within a the list. Animating out deletions can be done using a two step proccess where you render the item (but mark it as deleted), then do a later render where the item is actually removed.

<a href="./demo/reorder.html">Demo</a>

## Why Incremental DOM

Incremental DOM has two main strengths compared to virtual DOM based approaches:
* The incremental nature allows for significantly reduced memory allocation during render passes, allowing for more predictable performance.
* It easily maps to template based approaches. Control statements and loops can be mixed freely with element and attribute declarations.

Incremental DOM is a small (2.6kB min+gzip), standalone and unopinionated library. It renders DOM nodes and allows setting attributes/properties, but leaves the rest, including how to organize views, up to you. For example, an existing Backbone application could use Incremental DOM for rendering and updating DOM in place of a traditional template and manual update approach.

For more info <a href="https://medium.com/p/e98f79ce2c5f">read on here.</a>
