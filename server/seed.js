import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import Entry from '../models/entry';
import async from 'async';
import mongoose from 'mongoose';
import faker from 'faker';
import _ from 'underscore';
import config from '../config';

const orderStatuses = [
  constants.OPEN,
  constants.CLOSED,
  constants.READY_FOR_BILL
];

mongoose.connect(process.env.MONGOLAB_URI || config.developmentDB);

function removeData(next) {
  async.parallel([
    () => {
      console.log('Dropping orders collection');

      Order.remove({}, (err, res) => {
        if(err) {
          console.error(`Error dropping the orders colection. ${err}`);
        }

        console.log('Orders collection dropped');
      });
    },
    () => {
      console.log('Dropping orders collection');

      Item.remove({}, (err, res) => {
        if(err) {
          console.error(`Error dropping the orders colection. ${err}`);
        }

        console.log('Items collection dropped');
      });
    }
  ]);

  next();
}

function createItem(name, price, cb) {
  Item({ name, price }).save((err, result) => {
    cb(err, result);
  });
}

function createOrder(items, cb) {
  Order({
    id: faker.random.number(),
    status: _.sample(orderStatuses),
    entries: items.map(toEntry)
  }).save(cb);
}

function createItems(cb) {
  async.parallel([
    async.apply(createItem, 'Pho', 1050),
    async.apply(createItem, 'Burger', 925),
    async.apply(createItem, 'Rice', 175),
    async.apply(createItem, 'Dessert', 430)
  ], cb);
}

function createOrders(items, cb) {
  async.parallel([
    async.apply(createOrder, _.sample(items, 2)),
    async.apply(createOrder, _.sample(items, 2)),
    async.apply(createOrder, _.sample(items, 2)),
    async.apply(createOrder, _.sample(items, 2))
  ], cb);
}

function seedData() {
  async.waterfall([
    async.apply(removeData),
    async.apply(createItems),
    async.apply(createOrders)
  ], function (err, results) {
    if(err) {
      console.log('Error seeding database, plese try again.');
      process.exit(1);
    }

    console.log('Completed seeding database...');
    process.exit(0);
  });
}

function toEntry(item) {
  return {
    item_id: mongoose.Types.ObjectId(item.id),
    comment: faker.lorem.sentence()
  };
}

seedData();
