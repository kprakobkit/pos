import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import Entry from '../models/entry';
import mongoose from 'mongoose';
import faker from 'faker';
import _ from 'underscore';
import config from '../config';
import denodeify from 'denodeify';

const read = denodeify(require('fs').readFile);
const orderStatuses = [
  constants.OPEN
];

mongoose.connect(process.env.MONGOLAB_URI || config.developmentDB);

function removeData() {
  const collections = mongoose.connection.collections;
  const removeCollectionsPromise = _.map(collections, (collection) => {
    return new Promise((resolve, reject) => {
      collection.remove((err) => {
        if(err) {
          console.error(`Error removing ${collection.name} collection`);
          reject(err);
        }

        console.log(`Removed ${collection.name} collection`);
        resolve();
      });
    });
  });

  return Promise.all(removeCollectionsPromise);
}

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

function createOrder(items) {
  return new Promise((resolve, reject) => {
    Order({
      id: faker.random.number(),
      status: _.sample(orderStatuses),
      tableNumber: faker.random.number().toString().slice(0, 2),
      entries: items.map(toEntry)
    }).save((err, result) => {
      if(err) {
        console.error(`Error creating order. ${error}`);
        reject(err);
      }

      resolve();
    });
  });
}

function createItems() {
  return read('./server/items.csv', 'utf8').then((rawItems) => {
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

function createOrders(items) {
  return Promise.all([
    createOrder(_.sample(items, 2)),
    createOrder(_.sample(items, 2)),
    createOrder(_.sample(items, 2)),
    createOrder(_.sample(items, 2))
  ])
  .then(() => {
    console.log('Successfully created all orders');
  });
}

function seedData() {
  removeData()
  .then(createItems)
  .then(createOrders)
  .then(() => {
    console.log('Completed seeding database...');
    process.exit(0);
  })
  .catch((err) => {
    console.log(`Error seeding database, plese try again. ${err}`);
    process.exit(1);
  });
}

function toEntry(item) {
  return {
    item_id: mongoose.Types.ObjectId(item.id),
    comment: faker.lorem.sentence()
  };
}

seedData();
