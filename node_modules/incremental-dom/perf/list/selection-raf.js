import {Samples} from '../samples.js';
import {createItems} from './setup.js';

const ITEM_COUNT = 200;
const ITERATION_COUNT = 200;
const items = createItems(ITEM_COUNT);

export async function runSelectionRaf(impl) {
  const samples = new Samples(ITERATION_COUNT);
  const selectedKeys = {};
  let counter = 0;
  let selectedIndex = 0;

  impl.clear();
  impl.render({
      items,
      selectedKeys
  });

  function pass() {
    selectedKeys[items[selectedIndex].key] = false;
    selectedIndex = counter % ITEM_COUNT;
    selectedKeys[items[selectedIndex].key] = true;

    samples.timeStart();
    impl.render({
      items,
      selectedKeys
    });
    samples.timeEnd();

    counter += 1;
    return new Promise((resolve) => requestAnimationFrame(resolve));
  }

  for (let i = 0; i < ITERATION_COUNT; i += 1) {
    await pass();
  }

  return samples.data;
}
