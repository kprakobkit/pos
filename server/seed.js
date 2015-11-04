import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import async from 'async';

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
  order.items = [].concat(items);

  order.save();
}

function createItems(cb) {
  async.parallel([
    async.apply(createItem, 'Pho', 1050),
    async.apply(createItem, 'Rice', 925)
  ], cb);
}

function createOrders(items, cb) {
  async.parallel([
    async.apply(createOrder, '15', constants.OPEN, items),
    async.apply(createOrder, '16', constants.CLOSED, items),
    async.apply(createOrder, '17', constants.READY_FOR_BILL, items),
    async.apply(createOrder, '18', constants.OPEN, items)
  ], cb);
}

function seedData() {
  async.waterfall([
    async.apply(removeData),
    async.apply(createItems),
    async.apply(createOrders)
  ], function (err, results) {
    console.log('Completed seeding data...');
  });
}

export default seedData;
