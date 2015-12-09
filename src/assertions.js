/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
  * Keeps track whether or not we are in an attributes declaration (after
  * elementOpenStart, but before elementOpenEnd).
  * @type {boolean}
  */
var inAttributes = false;


/**
  * Keeps track whether or not we are in an element that should not have its
  * children cleared.
  * @type {boolean}
  */
var inSkip = false;


/**
 * Makes sure that there is a current patch context.
 * @param {*} context
 */
var assertInPatch = function(context) {
  if (!context) {
    throw new Error('Cannot call currentElement() unless in patch');
  }
};


/**
* Makes sure that keyed Element matches the tag name provided.
* @param {!string} nodeName The nodeName of the node that is being matched.
* @param {string=} tag The tag name of the Element.
* @param {?string=} key The key of the Element.
*/
var assertKeyedTagMatches = function(nodeName, tag, key) {
  if (nodeName !== tag) {
    throw new Error('Was expecting node with key "' + key + '" to be a ' +
        tag + ', not a ' + nodeName + '.');
  }
};


/**
 * Makes sure that a patch closes every node that it opened.
 * @param {?Node} openElement
 * @param {!Node|!DocumentFragment} root
 */
var assertNoUnclosedTags = function(openElement, root) {
  if (openElement === root) {
    return;
  }

  var currentElement = openElement;
  var openTags = [];
  while (currentElement && currentElement !== root) {
    openTags.push(currentElement.nodeName.toLowerCase());
    currentElement = currentElement.parentNode;
  }

  throw new Error('One or more tags were not closed:\n' +
      openTags.join('\n'));
};


/**
 * Makes sure that the caller is not where attributes are expected.
 * @param {string} functionName
 */
var assertNotInAttributes = function(functionName) {
  if (inAttributes) {
    throw new Error(functionName + '() may not be called between ' +
        'elementOpenStart() and elementOpenEnd().');
  }
};


/**
 * Makes sure that the caller is not inside an element that has declared skip.
 * @param {string} functionName
 */
var assertNotInSkip = function(functionName) {
  if (inSkip) {
    throw new Error(functionName + '() may not be called inside an element ' +
        'that has called skip().');
  }
};


/**
 * Makes sure that the caller is where attributes are expected.
 * @param {string} functionName
 */
var assertInAttributes = function(functionName) {
  if (!inAttributes) {
    throw new Error(functionName + '() must be called after ' +
        'elementOpenStart().');
  }
};


/**
 * Makes sure the patch closes virtual attributes call
 */
var assertVirtualAttributesClosed = function() {
  if (inAttributes) {
    throw new Error('elementOpenEnd() must be called after calling ' +
        'elementOpenStart().');
  }
};


/**
  * Makes sure that placeholders have a key specified. Otherwise, conditional
  * placeholders and conditional elements next to placeholders will cause
  * placeholder elements to be re-used as non-placeholders and vice versa.
  * @param {string} key
  */
var assertPlaceholderKeySpecified = function(key) {
  if (!key) {
    throw new Error('Placeholder elements must have a key specified.');
  }
};


/**
  * Makes sure that tags are correctly nested.
  * @param {string} nodeName
  * @param {string} tag
  */
var assertCloseMatchesOpenTag = function(nodeName, tag) {
  if (nodeName !== tag) {
    throw new Error('Received a call to close ' + tag + ' but ' +
        nodeName + ' was open.');
  }
};


/**
 * Makes sure that no children elements have been declared yet in the current
 * element.
 * @param {string} functionName
 * @param {?Node} previousNode
 */
var assertNoChildrenDeclaredYet = function(functionName, previousNode) {
  if (previousNode !== null) {
    throw new Error(functionName + '() must come before any child ' +
        'declarations inside the current element.');
  }
};


/**
 * Updates the state of being in an attribute declaration.
 * @param {boolean} value
 * @return {boolean} the previous value.
 */
var setInAttributes = function(value) {
  var previous = inAttributes;
  inAttributes = value;
  return previous;
};


/**
 * Updates the state of being in a skip element.
 * @param {boolean} value
 * @return {boolean} the previous value.
 */
var setInSkip = function(value) {
  var previous = inSkip;
  inSkip = value;
  return previous;
};


/** */
export {
  assertInPatch,
  assertKeyedTagMatches,
  assertNoUnclosedTags,
  assertNotInAttributes,
  assertInAttributes,
  assertPlaceholderKeySpecified,
  assertCloseMatchesOpenTag,
  assertVirtualAttributesClosed,
  assertNoChildrenDeclaredYet,
  assertNotInSkip,
  setInAttributes,
  setInSkip
};
