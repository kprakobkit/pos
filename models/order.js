import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import constants  from '../src/constants';
import Item from './item';
import Entry from './entry';
import Transaction from './transaction';
import _ from 'underscore';
import faker from 'faker';

const orderSchema = new Schema({
  id: String,
  status: { type: String, default: constants.OPEN },
  transaction: { type: Schema.ObjectId, ref: 'Transaction' },
  tableNumber: String,
  entries: [Entry.schema]
});

orderSchema.statics.getOrders = function() {
  return this.find()
    .then((orders) => orders.map(toOrder))
    .then(getEntries)
    .then(getTransactions);
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

orderSchema.statics.addOrder = function(tableNumber, entries) {
  return this({
    id: faker.random.number(), // need auto generated id...
    tableNumber,
    entries: entries.map((item) => ({
      item_id: mongoose.Types.ObjectId(item.id),
      comment: item.comment
    }))
  })
  .save()
  .then((order) => populateEntries(toOrder(order)));
}

orderSchema.statics.addEntries = function(orderId, newEntries) {
  return this.findOne({ id: orderId })
    .then((order) => {
      const entries = order.entries;
      const updatedEntries = newEntries.map((entry) => ({
        item_id: mongoose.Types.ObjectId(entry.id),
        comment: entry.comment
      }));

      order.entries = entries.concat(updatedEntries);
      return order.save();
    })
    .then((order) => populateEntries(toOrder(order)));
}

orderSchema.statics.updateStatus = function(orderId, status) {
  return this.findOneAndUpdate({ id: orderId }, { status }, { new: true }).then((order) => {
    return populateEntries(toOrder(order));
  });
}

orderSchema.statics.setClosed = function(orderId, transactionId) {
  const status = constants.CLOSED;
  const transaction = transactionId;
  return this.findOneAndUpdate(
    { id: orderId },
    { status, transaction },
    { new: true }
  )
    .then((order) => populateEntries(toOrder(order)))
    .then(populateTransaction);
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

function getTransactions(orders) {
  return Promise.all(orders.map(populateTransaction));
}

function populateTransaction(order) {
  return new Promise((resolve, reject) => {
    if (order.transaction) {
      Transaction.populate(order, {
        path: 'transaction',
        model: 'Transaction',
        select: 'cash credit tip -_id'
      }, (err, res) => {
        if (err) reject(err);

        order.transaction = toTransaction(res.transaction);
        resolve(order);
      });
    } else {
      resolve(order);
    }
  });
}

function toEntry({ status, comment, item_id, _id}) {
  const createdAt = _id.getTimestamp();

  return {
    status,
    comment,
    name: item_id.name,
    price: item_id.price,
    createdAt
  };
}

function toTransaction({ cash, credit, tip }) {
  return {
    cash,
    credit,
    tip
  };
}

function toOrder({ id, status, transaction, entries, tableNumber }) {
  return {
    id,
    status,
    transaction,
    entries,
    tableNumber
  };
}

export default mongoose.model('Order', orderSchema);
