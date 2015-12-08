import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import constants  from '../src/constants';
import Item from './item';
import Entry from './entry';
import Transaction from './transaction';
import _ from 'ramda';
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
    .then(_.map(toOrder))
    .then(getEntries)
    .then(getTransactions);
}

orderSchema.statics.updateEntry = function(orderId, entryIndex, update) {
  return this.findOne({ id: orderId })
    .then((order) => {
      const entries = _.map(_.invoker(0, 'toObject'), order.entries);
      order.entries = _.adjust(_.flip(_.merge)(update), entryIndex, entries);
      return order.save();
    })
    .then(_.compose(populateEntries, toOrder));
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
  .then(_.compose(populateEntries, toOrder));
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
    .then(_.compose(populateEntries, toOrder));
}

orderSchema.statics.updateStatus = function(orderId, status) {
  return this.findOneAndUpdate({ id: orderId }, { status }, { new: true }).then((order) => {
    return populateEntries(toOrder(order))
      .then(populateTransaction);
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
    .then(_.compose(populateEntries, toOrder))
    .then(populateTransaction);
}

function getEntries(orders) {
  return Promise.all(orders.map(populateEntries));
}

function populateEntries(order) {
  return new Promise((resolve, reject) => {
    Item.populate(order.entries, [{
      path: 'item_id',
      model: 'Item',
      select: 'name category price -_id'
    }], (err, res) => {
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
        select: '_id cash credit tip'
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
    category: item_id.category,
    createdAt
  };
}

function toTransaction({ _id, cash, credit, tip }) {
  return {
    id: _id.toString(),
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
