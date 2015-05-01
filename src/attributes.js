/**
 * @license
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

var getData = require('./node_data').getData;


var applyAttr = function(node, name, value) {
  var data = getData(node);
  var attrs = data.attrs;

  if (attrs[name] === value) {
    return;
  }
  
  var type = typeof value;

  if (value === undefined) {
    node.removeAttribute(name);
  } else if (type === 'object' || type === 'function') {
    node[name] = value;
  } else {
    node.setAttribute(name, value);
  }

  attrs[name] = value;
};


var applyStyle = function(node, style) {
  if (typeof style === 'string' || style instanceof String) {
    node.style.cssText = style;
  } else {
    node.style.cssText = '';

    for(var prop in style) {
      node.style[prop] = style[prop];
    }
  }
};


var updateAttribute = function(node, name, value) {
  switch(name) {
    case 'id':
      node.id = value;
      break;
    case 'class':
      node.className = value;
      break;
    case 'tabindex':
      node.tabIndex = value;
      break;
    case 'style':
      applyStyle(node, value);
      break;
    default:
      applyAttr(node, name, value);
      break;
  }
};


module.exports = {
  updateAttribute: updateAttribute
};

