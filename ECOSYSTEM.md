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

[superviews.js](https://github.com/davidjamesstone/superviews.js) is a template language that closely maps to the incremental-dom API. It includes conditionals, iteration, interpolation and supported output for both ES6 and CommonJS. 

Try it out [live in your browser](http://davidjamesstone.github.io/superviews.js/playground/)

```html
<p if="showMe" class="{cssClass}">
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

### incremental-dom-loader

[incremental-dom-loader](https://github.com/helloIAmPau/incremental-dom-loader) - An incremental-dom loader for webpack. It transpiles an HTML template file into an incremental-dom script.

```html
<h1>Hello!</h1>

<dom-if test="${ state.check() }">
  <dom-loop items="${ state.items }">
    <h2>${ value.title }</h2>
    <p>${ value.text }</p>
    <button onclick="${ state.love }">Show Love!</button>
  </dom-loop>
</dom-if>
```

```js
var id = require('incremental-dom');

module.exports = function(state) {
  id.elementOpen('h1', 'hio0k', []);
    id.text(`Hello!`);
  id.elementClose('h1');
  if(state.check()) {
    for(const key of Object.keys(state.items)) {
      const value = state.items[key];
      id.elementOpen('h2', `ncj5k-${ key }`, []);
        id.text(`${ value.title }`);
      id.elementClose('h2');
      id.elementOpen('p', `jde79-${ key }`, []);
        id.text(`${ value.text }`);
      id.elementClose('p');
      id.elementOpen('button', `eima7-${ key }`, [], 'onclick', state.love);
        id.text(`Show Love!`);
      id.elementClose('button');
    }
  }
}
```

### Create your own

If you work on a templating language we'd love to see Incremental DOM adopted as
an alternative backend for it. This isn’t easy, we are still working on ours and
will for a while, but we're super happy to help with it.

Here's an [example](https://gist.github.com/sparhami/197f3b947712998639eb).

## Libraries

### Skate

[Skate](https://github.com/skatejs/skatejs) is library that leverages [Incremental DOM](https://github.com/google/incremental-dom) to encourage functional [web components](http://w3c.github.io/webcomponents/explainer/).

### FerrugemJS

[FerrugemJS](https://ferrugemjs.github.io/home-page/) is a library inspired by Aurelia and React using [Incremental DOM](https://github.com/google/incremental-dom) with a easy and intuitive template language.

### Metal.js

[Metal.js](https://github.com/metal/metal.js) is a JavaScript library for building UI components in a solid, flexible way. It leverages [Incremental DOM](https://github.com/google/incremental-dom) and currently supports both [Closure Templates](https://developers.google.com/closure/templates/) and [JSX syntax](https://facebook.github.io/jsx/).

### Towser
[Towser](https://github.com/PongoEngine/Towser) is a web framework heavily inspired by the Elm Architechture using Google's Incremental-Dom. It is built to easily nest and compose Render Functions.

```haxe

class Main {
	static function main() {
		new Towser("app", update, view, {name: "Perdita"});
	}

	public static function view(model:Model) : RenderFunction<Model, Msg>
	{
		return div([class_("full-screen"), onclick(SayName.bind(model.name))], [
			h1([], [text("Hello")]),
			p([], [text(model.name)])
		]);
	}

	public static function update(msg:Msg, model:Model):Bool {
		switch msg {
			case SayName(name, e): trace(name);
		}
		return true;
	}
}

enum Msg {
	SayName(name :String, e :MouseEvent);
}

typedef Model =
{
	var name :String;
}

```
Towser can easlily be integrated with your favorite node framework by compiling it with the flag 'backend'.

### Falak JS
[Falak JS](https://github.com/falakjs/Falak) is a framework "**for lazy people**" built on top of Incremental Dom with a fully maximized and easy usage.

```html
<!-- home-page.component.html -->
<!-- If statements -->
<h1 *if="this.accountType == 'admin'">Welcome boss</h1>

<h1 *elseif="this.accountType == 'moderator'">Welcome {{ this.user.name }}</h1>

<h1 *else>Welcome visitor</h1>

<!-- Loops -->
<ul class="list-items">
  <li *for="let user of this.users">
    {{ user.name }}
  </li>
  <!-- Using the [html] directive as an alias -->
  <li *for="let user of this.users" [html]="user.name"></li>
  <!-- Using index -->
  <li *for="let user, index of this.users">
   {{ index }}- {{ user.name }}
  </li>
  <!-- Combining if with for loop -->
  <li *if="this.users.length > 0" *for="let user of this.users">...</li>
</ul>

<!-- Calling other components -->
<hello-world [account-type]="this.accountType">....</hello-world>
```
