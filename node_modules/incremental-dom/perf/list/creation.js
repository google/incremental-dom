import {Samples} from '../samples.js';
import {createItems} from './setup.js';

const ITEM_COUNT = 100;
const ITERATION_COUNT = 200;
const items = createItems(ITEM_COUNT);

export function runCreation(impl) {
  const samples = new Samples(ITERATION_COUNT);
  const selectedKeys = {};

  function pass() {
    impl.clear();

    samples.timeStart();
    impl.render({
      items: items,
      selectedKeys: selectedKeys
    });
    samples.timeEnd();
  }

  for (let i = 0; i < ITERATION_COUNT; i += 1) {
    pass();
  }

  return Promise.resolve(samples.data);
};
