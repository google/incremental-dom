(function(scope) {
  var ITEM_COUNT = 200;
  var ITERATION_COUNT = 400;
  var ITEMS = MutationSetup.createItems(ITEM_COUNT);

  var run = function(impl) {
    var samples = new Samples(ITERATION_COUNT);
    var items = ITEMS.map((item) => Object.assign({}, item));

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

