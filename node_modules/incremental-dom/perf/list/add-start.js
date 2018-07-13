import {Samples} from '../samples.js';
import {createItems} from './setup.js';
import {afterRenderPromise} from '../util.js';

const ITEM_COUNT = 100;
const ITERATION_COUNT = 100;
const INSERT_COUNT = 1;
const allItems = createItems(ITEM_COUNT + INSERT_COUNT);
const itemsWithoutAddition = allItems.slice(INSERT_COUNT);

export async function runAddStart(impl) {
  const samples = new Samples(ITERATION_COUNT);
  const selectedKeys = {};

  async function reset() {
    impl.render({
      items: itemsWithoutAddition,
      selectedKeys,
    });
    // Make sure the layout time from putting the list back in the correct
    // state is not a part of the measurement below.
    await afterRenderPromise();  
  }

  async function update() {
    impl.render({
      items: allItems,
      selectedKeys,
    });
    // Wait until after the browser has rendered so that we get a better
    // picture of how much time we are actually spending, not just the JS time.
    await afterRenderPromise();
  }

  async function pass() {
    await reset();

    samples.timeStart();
    await update();
    samples.timeEnd();
  }

  for (let i = 0; i < ITERATION_COUNT; i += 1) {
    await pass();
  }

  return samples.data;
};
