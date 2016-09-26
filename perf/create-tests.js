function createTests(Renderer, tests, impls) {
  var patch = IncrementalDOM.patch;
  var eo = IncrementalDOM.elementOpen;
  var ec = IncrementalDOM.elementClose;
  var tx = IncrementalDOM.text;

  var currentTest;
  var currentImpl;
  var currentRenderer;
  var results;
  var running;

  var container = document.createElement('div');
  var testContainer = document.createElement('div');
  container.id = 'container';

  document.body.appendChild(container);
  document.body.appendChild(testContainer);
  document.head.insertAdjacentHTML('beforeEnd', `
    <style>
      #container [aria-selected="true"] {
        color: white;
        background-color: blue;
      }

      #container button {
        margin: 4px 4px;
      }
    </style>
  `);

  function update() {
    patch(container, render);
  }

  function setTestAndImpl(test, impl) {
    currentTest = test;
    currentImpl = impl;
    currentRenderer = new Renderer(testContainer, impl.obj);

    running = true;
    update(); 
    run();

    window.location.hash = impls.indexOf(impl) + ',' + tests.indexOf(test);
  }

  function setTest(test) {
    setTestAndImpl(test, currentImpl);
  }

  function setImpl(impl) {
    setTestAndImpl(currentTest, impl);
  }

  function render() {
    eo('div');
      impls.forEach(function(impl) {
        eo('button', null, null,
            'disabled', running || undefined,
            'aria-selected', currentImpl === impl,
            'onclick', function() { setImpl(impl); });
          tx(impl.name);
        ec('button');
      });
    ec('div');

    eo('div');
      tests.forEach(function(test) {
        eo('button', null, null,
            'disabled', running || undefined,
            'aria-selected', currentTest === test,
            'onclick', function() { setTest(test); });
          tx(test.name);
        ec('button');
      });
    ec('div');

    eo('div');
     if (running) {
       tx('running');
     } else {
       tx(results);
     }
    ec('div');
  }

  function delay(time) {
    return new Promise(function(resolve) { setTimeout(resolve, time); });
  }

  function run() {
    delay(100)
      .then(function() { return currentTest.fn.run(currentRenderer) })
      .then(function(samples) { return Stats.avg(Stats.filterOutliers(samples)) })
      .then(function(avg) {
        results = `time per iteration: ${avg.toFixed(3)}ms`;
        running = false;
        update();
      });
  }

  var parts = window.location.hash.substring(1).split(',');
  var impl = Number(parts[0]) || 0;
  var test = Number(parts[1]) || 0;

  setTestAndImpl(tests[test], impls[impl]);
}
