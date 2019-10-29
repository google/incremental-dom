# Change Log

## 0.7.0

- Added an option to specify which attribute to use for a key when importing
  DOM nodes
- Improve handling of cached value for `Text` nodes when using formatting
  functions
- Added an option to specify a custom matching function via `createPatchInner`
  and `createPatchOuter`
- Added a call flow to open an element, then apply attributes using the new
  `applyStatics` and `applyAttrs` functions along with the existing `open` and
  `close` calls, allowing you to use information from the element in when
  specifying the attributes
- Improved performance of the `elementOpenStart`, `attr`, `elementOpenEnd` call
  sequence
- Fix assertion when updating the `style` of an element from another `Document`


## 0.6.0

- Added support for MathML
- Removed restriction that keys are unique within a parent Element
- Added better handling of statics when importing an Element
- Allow importing of server-side rendered DOM without transmitting keys
  - This relies on the first patch being a no-op in order for things to line up
    correctly
- `elementOpen` and friends can now take a CustomElement constructor instead of
  a tag name
- Added an output target that generates Closure Compiler typed code

## 0.5.0

- Removed `symbols.placeholder`
- Removed `#elementPlaceholder`
- Fixed camelCase SVG tags not being imported correctly
- Fixed bug where focus was not being maintained on a keyed item
- Changed `#patchOuter` to allow removing or replacing the node with another
  single node
- Changed keyed items to allow being replaced with a different tag
- Added `#importNode` function to help perserve DOM mutations made on DOM
  before the first patch
- Added `#currentPoiner` - the next Node Incrementl DOM will patch
- Added `#skipNode` - skips the node pointed to by `#currentPointer`
- Added support for dashed CSS properties (e.g. `background-color`), including
  CSS custom properties, in a style object

## 0.4.0

- Deprecated `symbols.placeholder`, will be removed in 0.5.0
- Fixed performance issue with `text` call
- Added `patchOuter` function, which patches an Element rather than an
  Element's children
- Added `patchInner` as an alias of `patch`
- Added support for `xlink:href` and other `xlink:` attributes

## 0.3.0

- Added `skip` function
- Added `currentElement` function
- Added more asserts

## 0.2.0

- Added asserts to non-minified build to help ensure proper usage
- Added support for creating SVG elements
- Fixed two bugs related to attributes not being properly updated or removed
- Changed `null` and `undefined` keys to be treated as equivalent
- Added an optional parameter to patch to pass data
- Changed elementOpen, elementVoid, elementClose to return the associated Element
- Added hooks to specify how attributes/properties are set
- Changed main file to not include a UMD header
- Added formatting function variable arguments to the `text` function


## 0.1.0

- Initial release
