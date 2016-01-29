# The Incremental DOM Ecosystem

The page contains a list of tools and libraries that use or can be used with Incremental DOM. If you have something that you have worked on and would like to share, please feel free to send us a pull request to add it here.

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

[starplate](https://github.com/littlstar/starplate) is a fast template and view engine built on top of the incremental-dom API. It makes use of ES6 template strings for interpolation, [parse5](https://github.com/inikulin/parse5) for DOM traversal, and incremental-dom for DOM patches.

Consider the following rudimentary example for rendering and updating a clock.

```js
import {View} from 'starplate';
const clock = new View('<section>Time <span class="time">${time}</span></section>')
clock.render(document.body);
setInterval(_ => clock.update({time: Date()}, 1000);
```

### khufu

[khufu](http://github.com/tailhook/khufu) is a template engine with a concise indentation-based syntax, and integration with [redux](http://github.com/rackt/redux):

```html
view main():
  <div.counter-body>
    store @counter = Counter
    <input disabled size="6" value=@counter>
    <input type="button" value="+">
       link {click} incr(1) -> @counter
```

Khufu is a little bit more than a template engine as it allows you to add create local redux stores. This allows tracking local state like whether an accordion is expanded or whether a tooltip is shown without additional javascript boilerplate. The library implements useful scoping rules for stores as well as for styles included into the template.

And khufu supports **hot reload**!

### jsonml2idom

[jsonml2idom](https://github.com/paolocaminiti/jsonml2idom) - JSONML to Incremental DOM interpreter.
```js
function app(state) {
  return ['h1', 'Hello World!']
}

IncrementalDOM.patch(root, jsonml2idom, app(state))
```

### Create your own

If you work on a templating language we'd love to see Incremental DOM adopted as
an alternative backend for it. This isn’t easy, we are still working on ours and
will for a while, but we're super happy to help with it.

Here's an [example](https://gist.github.com/sparhami/197f3b947712998639eb).
