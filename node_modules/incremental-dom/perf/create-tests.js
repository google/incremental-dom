import {avg, filterOutliers} from './stats.js';

export function createTests(Renderer, tests, impls) {
  const {
    patch,
    elementOpen: eo,
    elementClose: ec,
    text: tx,
  } = IncrementalDOM;

  let currentTest;
  let currentImpl;
  let currentRenderer;
  let results;
  let running;

  const container = document.createElement('div');
  const testContainer = document.createElement('div');
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

  async function run() {
    await delay(100);
    const samples = await currentTest.fn(currentRenderer);
    const average = avg(filterOutliers(samples));

    results = `time per iteration: ${average.toFixed(3)}ms`;
    running = false;
    update();
  }

  const parts = window.location.hash.substring(1).split(',');
  const impl = Number(parts[0]) || 0;
  const test = Number(parts[1]) || 0;

  setTestAndImpl(tests[test], impls[impl]);
}
