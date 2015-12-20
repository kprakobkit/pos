import denodeify from 'denodeify';
import Item from '../models/item';

const read = denodeify(require('fs').readFile);

function createItem(type, name, price, category) {
  return new Promise((resolve, reject) => {
    Item({ type, name, price, category }).save((err, result) => {
      if(err) {
        console.error(`Error creating item ${name}. ${err}`);
        reject(err);
      }

      resolve(result);
    });
  });
}

export function createItems() {
  return read('./data-creation/items.csv', 'utf8').then((rawItems) => {
    const rows = rawItems.split('\n').slice(0, -1);
    const itemsPromise = rows.map((row) => {
      const [type, name, price, category] = row.split(',');
      return createItem(type, name, parseInt(price), category);
    });
    return Promise.all(itemsPromise);
  })
  .then((items) => {
    console.log('Successfully created all items');
    return items;
  });
}
