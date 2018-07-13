export function before(obj, fnName, cb) {
  var old = obj[fnName];

  obj[fnName] = function() {
    cb();
    return old.apply(this, arguments);
  }
}
