import {getData, initData} from './node_data';
import {Key, NameOrCtorDef} from './types';


/**
 * Gets the namespace to create an element (of a given tag) in.
 */
function getNamespaceForTag(tag: string, parent: Node|null) {
  if (tag === 'svg') {
    return 'http://www.w3.org/2000/svg';
  }
  
  if (tag === 'math') {
    return 'http://www.w3.org/1998/Math/MathML';
  }

  if (parent == null) {
    return null;
  }

  if (getData(parent).nameOrCtor === 'foreignObject') {
    return null;
  }

  return parent.namespaceURI;
}


/**
 * Creates an Element.
 * @param doc The document with which to create the Element.
 * @param nameOrCtor The tag or constructor for the Element.
 * @param key A key to identify the Element.
 * @param  typeId The type identifier for the Element.
 */
function createElement(
    doc: Document, parent: Node|null, nameOrCtor: NameOrCtorDef, key: Key)
    : Element {
  let el;

  if (typeof nameOrCtor === 'function') {
    el = new nameOrCtor();
  } else {
    const namespace = getNamespaceForTag(nameOrCtor, parent);

    if (namespace) {
      el = doc.createElementNS(namespace, nameOrCtor);
    } else {
      el = doc.createElement(nameOrCtor);
    }
  }

  initData(el, nameOrCtor, key);

  return el;
}


/**
 * Creates a Text Node.
 * @param doc The document with which to create the Element.
 * @return
 */
function createText(doc: Document) {
  const node = doc.createTextNode('');
  initData(node, '#text', null);
  return node;
}


/** */
export {
  createElement,
  createText,
};
