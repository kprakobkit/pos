import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import Entry from '../models/entry';
import async from 'async';
import mongoose from 'mongoose';
import faker from 'faker';
import _ from 'underscore';

const orderStatuses = [
  constants.OPEN,
  constants.CLOSED,
  constants.READY_FOR_BILL
];

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost');

function removeData(next) {
  async.parallel([
    () => {
      Order.remove({}, (err, res) => {
        console.log('Orders collection dropped');
      });
    },
    () => {
      Item.remove({}, (err, res) => {
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

function createEntry(item, cb) {
  Entry({
    id: faker.random.number(),
    item_id: mongoose.Types.ObjectId(item.id),
    comment: faker.lorem.sentence()
  }).save((err, result) => cb(err, result));
}

function createOrder(entries, cb) {
  Order({
    id: faker.random.number(),
    status: _.sample(orderStatuses),
    entries
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

function createEntries(items, cb) {
  async.parallel(items.concat(items).map((item) => {
    return async.apply(createEntry, item);
  }), cb);
}

function createOrders(entries, cb) {
  async.parallel([
    async.apply(createOrder, entries.slice(0, 2)),
    async.apply(createOrder, entries.slice(2, 4)),
    async.apply(createOrder, entries.slice(4, 6)),
    async.apply(createOrder, entries.slice(6, 8))
  ], cb);
}

function seedData() {
  async.waterfall([
    async.apply(removeData),
    async.apply(createItems),
    async.apply(createEntries),
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

seedData();
