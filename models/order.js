import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import constants  from '../src/constants';
import Item from './item';
import Entry from './entry';
import _ from 'underscore';

const orderSchema = new Schema({
  id: String,
  status: { type: String, default: constants.OPEN },
  entries: [Entry.schema]
});

orderSchema.statics.getOrders = function() {
  return this.find()
    .then((orders) => orders.map(toOrder))
    .then(getEntries);
}

orderSchema.statics.updateEntry = function(orderId, entryIndex, update) {
  return this.findOne({ id: orderId })
    .then((order) => {
      const entries = order.entries;
      const entry = entries[entryIndex];
      const updatedEntries = [
        ...entries.slice(0, entryIndex),
        _.extend(entry, update),
        ...entries.slice(entryIndex + 1)
      ];

      order.entries = updatedEntries;
      return order.save();
    })
    .then((order) => populateEntries(toOrder(order)));
}

orderSchema.statics.addEntries = function(orderId, newEntries) {
  return this.findOne({ id: orderId }).then((order) => {
    const entries = order.entries;
    const updatedEntries = newEntries.map((entry) => ({
      item_id: mongoose.Types.ObjectId(entry.id),
      comment: entry.comment
    }));

    order.entries = entries.concat(updatedEntries);
    return order.save();
  })
}

orderSchema.statics.updateStatus = function(orderId, status) {
  return this.findOneAndUpdate({ id: orderId }, { status }, { new: true }).then((order) => {
    return populateEntries(toOrder(order));
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
