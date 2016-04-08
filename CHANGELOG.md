# Change Log

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
