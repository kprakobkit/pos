import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import Entry from '../models/entry';
import Discount from '../models/discount';
import User from '../models/user';
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


function createOrder(items, discounts) {
  return new Promise((resolve, reject) => {
    Order({
      id: faker.random.number(),
      status: _.sample(orderStatuses),
      tableNumber: faker.random.number().toString().slice(0, 2),
      entries: items.map(toEntry),
      discounts
    }).save((err, result) => {
      if(err) {
        console.error(`Error creating order. ${error}`);
        reject(err);
      }

      resolve();
    });
  });
}

function createDiscount(discount) {
  return new Promise((resolve, reject) => {
    Discount(discount).save((err, result) => {
      if(err) {
        console.error(`Error creating discount. ${error}`);
        reject(err);
      }

      resolve(result);
    });
  });
}
function createUser(name, pin) {
  return new Promise((resolve, reject) => {
    User({ name, pin }).save((err, result) => {
      if(err) {
        console.error(`Error creating user. ${error}`);
        reject(err);
      }

      console.log(`Successfully created ${name} user`);
      resolve();
    });
  });
}

function createOrders(itemsAndDiscounts) {
  const [items, discounts] = itemsAndDiscounts;

  return Promise.all([
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

function createDiscounts() {
  return Promise.all([
    createDiscount({
      value: 0.5,
      type: constants.PERCENTAGE,
      description: 'Band discount (50%)'
    })
  ])
  .then((discounts) => {
    console.log('Successfully created all discounts');
    return discounts;
  });
}

function createItemsAndDiscounts() {
  return Promise.all([
    createItems(),
    createDiscounts()
  ]);
}
export function seedDev() {
  removeData()
  .then(createItemsAndDiscounts)
  .then(createOrders)
  .then(createUser.bind(null, 'Awesome Server', 1234))
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
