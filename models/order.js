import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import constants  from '../src/constants';
import Item from './item';
import Entry from './entry';

const orderSchema = new Schema({
  id: String,
  status: { type: String, default: constants.OPEN },
  entries: [Entry]
});

orderSchema.statics.getOrders = function() {
  return getOrders.apply(this)
  .then(getEntries)
  .catch((e) => {
    throw new Error(e);
  });
}

function getOrders() {
  const Order = this;

  return new Promise((resolve, reject) => {
    Order.find().exec((err, orders) => {
      if(err) {
        reject(err);
      }

      resolve(orders.map(toOrder));
    });
  });
}

function populateEntries(order) {
  return new Promise((resolve, reject) => {
    Item.populate(order.entries, [{ path: 'item_id', model: 'Item', select: 'name price -_id' }], (err, res) => {
      if(err) {
        reject(err);
      }

      resolve(res);
    });
  });
}

function getEntries(orders) {
  return Promise.all(orders.map(populateEntries)).then((entries) => {
    orders.forEach((order, index) => {
      order.entries = entries[index].map(toEntry);
    });

    return Promise.resolve(orders);
  });
}

function toEntry({ status, comment, item_id }) {
  return {
    status,
    comment,
    name: item_id.name,
    price: item_id.price
  };
}

function toOrder({ id, status, entries }) {
  return {
    id,
    status,
    entries
  };
}

export default mongoose.model('Order', orderSchema);
