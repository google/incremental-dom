(function(scope) {
  var ITEM_COUNT = 200;
  var ITERATION_COUNT = 400;
  var items = ListSetup.createItems(ITEM_COUNT);


  var run = function(impl) {
    var samples = new Samples(ITERATION_COUNT);
    var counter = 0;
    var index = 0;
    var selectedKeys = {};

    impl.clear();
    impl.render({
       items: items,
       selectedKeys: selectedKeys
    });

    function pass() {
      selectedKeys[items[index].key] = false;
      index = counter % ITEM_COUNT;
      selectedKeys[items[index].key] = true;

      samples.timeStart();
      impl.render({
        items: items,
        selectedKeys: selectedKeys
      });
      samples.timeEnd();

      counter++;
    }

    for (var i = 0; i < ITERATION_COUNT; i += 1) {
      pass();
    }

    return Promise.resolve(samples.data);
  };

  scope.Selection = {
    run: run
  };

})(window);

