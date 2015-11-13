import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import async from 'async';
import mongoose from 'mongoose';
import faker from 'faker';
import _ from 'underscore';

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

function createOrder(id, status, items, cb) {
  const order = Order({ id, status });

  order.entries = items.map((item) => ({
    id: faker.random.number(),
    item_id: mongoose.Types.ObjectId(item.id),
    comment: faker.lorem.sentence()
  }));

  order.save(cb);
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
    async.apply(createOrder, faker.random.number(), constants.OPEN, _.sample(items, 2)),
    async.apply(createOrder, faker.random.number(), constants.CLOSED, _.sample(items, 2)),
    async.apply(createOrder, faker.random.number(), constants.READY_FOR_BILL, _.sample(items, 2)),
    async.apply(createOrder, faker.random.number(), constants.OPEN, _.sample(items, 2))
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

seedData();
