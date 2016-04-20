(function(scope) {
  var ITEM_COUNT = 200;
  var ITERATION_COUNT = 200;
  var items = ListSetup.createItems(ITEM_COUNT);

  var run = function(impl) {
    var samples = new Samples(ITERATION_COUNT);
    var counter = 0;
    var selectedIndex = 0;
    var selectedKeys = {};

    impl.clear();
    impl.render({
       items: items,
       selectedKeys: selectedKeys
    });

    return new Promise(function(resolve) {
      function pass() {
        if (counter >= ITERATION_COUNT - 1) {
          resolve(samples.data);
          return;
        }

        selectedKeys[items[selectedIndex].key] = false;
        selectedIndex = counter % ITEM_COUNT;
        selectedKeys[items[selectedIndex].key] = true;

        samples.timeStart();
        impl.render({
          items: items,
          selectedKeys: selectedKeys
        });
        samples.timeEnd();

        counter++;
        requestAnimationFrame(pass);
      }

      requestAnimationFrame(pass);
    });
  };

  scope.SelectionRaf = {
    run: run
  };

})(window);

