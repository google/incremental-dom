(function(scope) {
  var ITEM_COUNT = 200;
  var ITERATION_COUNT = 200;
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
    var counter = 0;
    var items = ITEMS.map(function(item) { return assign({}, item) });

    impl.clear();
    impl.render({
       items: items
    });

    return new Promise(function(resolve) {
      function pass() {
        if (counter >= ITERATION_COUNT - 1) {
          resolve(samples.data);
          return;
        }

        MutationSetup.updateItems(items);

        samples.timeStart();
        impl.render({
          items: items
        });
        samples.timeEnd();

        counter += 1;

        requestAnimationFrame(pass);
      }

      requestAnimationFrame(pass);
    });
  };

  scope.HighRaf = {
    run: run
  };

})(window);

