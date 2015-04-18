var shouldUpdateHooks = {};


var getShouldUpdateHook = function(attrs) {
  for (var key in shouldUpdateHooks) {
    if (key in attrs) {
      return shouldUpdateHooks[key];
    }
  }
};


var addShouldUpdateHook = function(attrName, hook) {
  shouldUpdateHooks[attrName] = hook;
};


var removeShouldUpdateHook = function(attrName) {
  delete shouldUpdateHooks[attrName];
};


module.exports = {
  getShouldUpdateHook: getShouldUpdateHook,
  addShouldUpdateHook: addShouldUpdateHook,
  removeShouldUpdateHook: removeShouldUpdateHook
};

