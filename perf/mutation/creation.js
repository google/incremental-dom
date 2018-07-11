import {Samples} from '../samples.js';
import {createItems} from './setup.js';

const ITEM_COUNT = 100;
const ITERATION_COUNT = 200;
const items = createItems(ITEM_COUNT);

export function runCreation(impl) {
  const samples = new Samples(ITERATION_COUNT);

  function pass() {
    impl.clear();

    samples.timeStart();
    impl.render({
      items,
    });
    samples.timeEnd();
  }

  for (var i = 0; i < ITERATION_COUNT; i += 1) {
    pass();
  }

  return samples.data;
};

