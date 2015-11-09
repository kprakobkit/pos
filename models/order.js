import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import constants  from '../src/constants';
import Promise from 'promise';
import Item from './item';

const Entry = new Schema({
  item_id: { type: Schema.ObjectId, ref: 'Item' },
  status: { type: String, default: constants.OPEN },
  comment: String
});


const orderSchema = new Schema({
  id: String,
  status: { type: String, default: constants.OPEN },
  entries: [Entry]
});

orderSchema.statics.getOrders = function(cb) {
  getOrders.apply(this)
  .then(getEntries)
  .then(cb).catch((e) => {
    throw new Error(e);
  });
}

function getOrders() {
  let Order = this;
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

    return orders;
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

export function toOrder({ id, status, entries }) {
  return {
    id,
    status,
    entries: entries
  };
}

export const Order = mongoose.model('Order', orderSchema);
