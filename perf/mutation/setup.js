let uidGen = 1;

function uid() {
  return uidGen++;
}

function randomPercent() {
  return (Math.random() - 0.5) * 0.3;
}

function randomValue() {
  return Math.random() * 700;
}

function randomChars() {
  return (Math.random() + 1).toString(36).substring(2, 10);
}

function randomText(count) {
  return new Array(count).fill(0).map(randomChars).join();
}

function createItem() {
  return Object.freeze({
    key: '' + uid(),
    name: randomText(1),
    value: randomValue(),
    change: randomPercent()
  });
}

export function createItems(count) {
  return new Array(count).fill(0).map(createItem);
}

export function updateItems(items) {
  items.forEach((item, i) => {
    const change = randomPercent();
    items[i].value *= (1 + change);
    items[i].change = change;
  });
}
