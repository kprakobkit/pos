import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import constants  from '../src/constants';
import Item from './item';
import Entry from './entry';

const orderSchema = new Schema({
  id: String,
  status: { type: String, default: constants.OPEN },
  entries: [Entry.schema]
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

function getEntries(orders) {
  return Promise.all(orders.map(populateEntries));
}

function populateEntries(order) {
  return new Promise((resolve, reject) => {
    Item.populate(order.entries, [{ path: 'item_id', model: 'Item', select: 'name price -_id' }], (err, res) => {
      if(err) {
        reject(err);
      }
      order.entries = res.map(toEntry);

      resolve(order);
    });
  });
}

function toEntry({ id, status, comment, item_id }) {
  return {
    id,
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
