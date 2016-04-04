(function(scope) {
  var ITEM_COUNT = 200;
  var ITERATION_COUNT = 400;
  var ITEMS = MutationSetup.createItems(ITEM_COUNT);

  var assign = function(output) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          output[prop] = source[prop];
        }
      }
    }
    return output;
  };

  var run = function(impl) {
    var samples = new Samples(ITERATION_COUNT);
    var items = ITEMS.map(function(item) { return assign({}, item) });

    impl.clear();
    impl.render({
       items: items
    });

    function pass() {
      MutationSetup.updateItems(items);

      samples.timeStart();
      impl.render({
        items: items
      });
      samples.timeEnd();
    }

    for (var i = 0; i < ITERATION_COUNT; i += 1) {
      pass();
    }

    return Promise.resolve(samples.data);
  };

  scope.High = {
    run: run
  };

})(window);

