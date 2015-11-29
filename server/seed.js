import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import Entry from '../models/entry';
import mongoose from 'mongoose';
import faker from 'faker';
import _ from 'underscore';
import config from '../config';

const orderStatuses = [
  constants.OPEN,
  constants.CLOSED
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

function createItem(name, price, cb) {
  return new Promise((resolve, reject) => {
    Item({ name, price }).save((err, result) => {
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

function createItems(cb) {
  return Promise.all([
    createItem('Pho', 1050),
    createItem('Burger', 925),
    createItem('Rice', 175),
    createItem('Dessert', 430)
  ])
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
