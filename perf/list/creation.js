(function(scope) {
  var ITEM_COUNT = 100;
  var ITERATION_COUNT = 200;
  var items = ListSetup.createItems(ITEM_COUNT);

  var run = function(impl) {
    var samples = new Samples(ITERATION_COUNT);
    var selectedKeys = {};

    function pass() {
      impl.clear();

      samples.timeStart();
      impl.render({
        items: items,
        selectedKeys: selectedKeys
      });
      samples.timeEnd();
    }

    for (var i = 0; i < ITERATION_COUNT; i += 1) {
      pass();
    }

    return Promise.resolve(samples.data);
  };

  scope.Creation = {
    run: run
  };

})(window);

