import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import async from 'async';

function removeData(next) {
  async.parallel([
    () => {
      Order.remove({}, () => {
        console.log('Orders collection dropped');
      });
    },
    () => {
      Item.remove({}, () => {
        console.log('Items collection dropped');
      });
    }
  ]);

  next();
}

function createItem(itemAttr, cb) {
  Item({
    name: itemAttr.name,
    price: itemAttr.price
  }).save(cb);
}

function createOrder(orderAttr, cb) {
  Order({
    id: orderAttr.id,
    status: orderAttr.status,
    items: orderAttr.items._id
  }).save(cb);
}

function createItems(cb) {
  async.parallel([
    async.apply(createItem, { name: 'Pho', price: 1050 }),
    async.apply(createItem, { name: 'Rice', price: 925 })
  ], cb);
}

function createOrders(items, cb) {
  async.parallel([
    async.apply(createOrder, { id: '15', status: constants.OPEN, items: items[0][0] }),
    async.apply(createOrder, { id: '16', status: constants.CLOSED, items: items[1][0] }),
    async.apply(createOrder, { id: '17', status: constants.READY_FOR_BILL, items: items[0][0] }),
    async.apply(createOrder, { id: '18', status: constants.OPEN, items: items[1][0] })
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
