import {Samples} from '../samples.js';
import {createItems} from './setup.js';

const ITEM_COUNT = 200;
const ITERATION_COUNT = 400;
const items = createItems(ITEM_COUNT);

export function runSelection (impl) {
  const samples = new Samples(ITERATION_COUNT);
  const selectedKeys = {};
  let counter = 0;
  let index = 0;

  impl.clear();
  impl.render({
      items,
      selectedKeys
  });

  function pass() {
    selectedKeys[items[index].key] = false;
    index = counter % ITEM_COUNT;
    selectedKeys[items[index].key] = true;

    samples.timeStart();
    impl.render({
      items,
      selectedKeys
    });
    samples.timeEnd();

    counter++;
  }

  for (let i = 0; i < ITERATION_COUNT; i += 1) {
    pass();
  }

  return samples.data;
}