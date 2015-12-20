import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import Entry from '../models/entry';
import faker from 'faker';
import _ from 'underscore';
import createItems from './create_items';
import mongoose from 'mongoose';

const orderStatuses = [
  constants.OPEN
];

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

function toEntry(item) {
  return {
    item_id: mongoose.Types.ObjectId(item.id),
    comment: faker.lorem.sentence()
  };
}

export function seedDev() {
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

export function seedItems() {
  createItems()
  .then(() => {
    console.log('Completed seeding items...');
    process.exit(0);
  })
  .catch((err) => {
    console.log(`Error seeding items, plese try again. ${err}`);
    process.exit(1);
  });
}
