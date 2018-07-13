let uidGen = 1;

function uid() {
  return uidGen++;
}

function randomChars() {
  return (Math.random() + 1).toString(36).substring(2);
}

function randomText(count) {
  return new Array(count).fill(0).map(randomChars).join();
}

function createItem() {
  return {
    key: '' + uid(),
    sender: randomText(1),
    subject: randomText(4),
    date: 'July 4'
  };
}

export function createItems(count) {
  return new Array(count).fill(0).map(createItem);
}
