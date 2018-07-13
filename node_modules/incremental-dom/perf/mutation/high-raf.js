import {Samples} from '../samples.js';
import {createItems, updateItems} from './setup.js';

const ITEM_COUNT = 200;
const ITERATION_COUNT = 200;
const ITEMS = createItems(ITEM_COUNT);

export async function runHighRaf(impl) {
  const samples = new Samples(ITERATION_COUNT);
  const items = ITEMS.map(item => Object.assign({}, item));

  impl.clear();
  impl.render({
      items,
  });

  function pass() {
    updateItems(items);

    samples.timeStart();
    impl.render({
      items,
    });
    samples.timeEnd();

    return new Promise((resolve) => requestAnimationFrame(resolve));
  }

  for (let i = 0; i < ITERATION_COUNT; i += 1) {
    await pass();
  }

  return samples.data;
}
