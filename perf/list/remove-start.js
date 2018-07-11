import {Samples} from '../samples.js';
import {createItems} from './setup.js';
import {afterRenderPromise} from '../util.js';

const ITEM_COUNT = 100;
const ITERATION_COUNT = 100;
const REMOVE_COUNT = 1;
const allItems = createItems(ITEM_COUNT);
const itemsWithRemoval = allItems.slice(REMOVE_COUNT);

export async function runRemoveStart(impl) {
  const samples = new Samples(ITERATION_COUNT);
  const selectedKeys = {};

  async function pass() {
    impl.render({
      items: allItems,
      selectedKeys,
    });
    // Make sure the layout time from putting the list back in the correct
    // state is not a part of the measurement below.
    await afterRenderPromise();

    samples.timeStart();
    impl.render({
      items: itemsWithRemoval,
      selectedKeys,
    });
    // Wait until after the browser has rendered so that we get a better
    // picture of how much time we are actually spending, not just the JS time.
    await afterRenderPromise();
    samples.timeEnd();
  }

  for (let i = 0; i < ITERATION_COUNT; i += 1) {
    await pass();
  }

  return samples.data;
};
