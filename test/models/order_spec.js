import utils from '../utils';
import Order from '../../models/order';
import Item from '../../models/item';
import Discount from '../../models/discount';
import Transaction from '../../models/transaction';
import { expect } from 'chai';
import faker from 'faker';
import constants from '../../src/constants';

describe('Order', () => {
  it ('defaults to OPEN status', () => {
    return Order().save()
    .then((newOrder) => {
      expect(newOrder.status).to.equal(constants.OPEN);
    });
  });

  it('getOrders', () => {
    const tableNumber = '10';
    const entryName = 'Rice';
    const entryPrice = 1000;
    const transactionAmounts = {
      cash: 1500,
      credit: 2000,
      tip: 800
    };

    return Item({ name: entryName, price: entryPrice }).save()
      .then((item) => Order.addOrder(tableNumber, [item]))
      .then((order) => Transaction.addTransaction(order.id, transactionAmounts))
      .then((transaction) => Order.setClosed(transaction.orderId, transaction._id))
      .then(() => Order.getOrders())
      .then((orders) => {
        const order = orders[0];
        expect(order.entries[0].name).to.equal(entryName);
        expect(order.entries[0].price).to.equal(entryPrice);
        expect(order.transaction.cash).to.equal(transactionAmounts.cash);
        expect(order.transaction.credit).to.equal(transactionAmounts.credit);
        expect(order.transaction.tip).to.equal(transactionAmounts.tip);
      });
  });

  describe('updateEntry', () => {
    beforeEach(() => {
      return Item({
        name: 'Rice',
        price: 1000,
        category: 'Side'
      }).save();
    });

    it('updates and returns the specified entry', () => {
      const entryIndex = 1;
      const updatedStatus = constants.DELIVERED;

      return Item.findOne({ name: 'Rice' })
        .then((item) => Order.addOrder('1', [item, item]))
        .then((order) => Order.updateEntry(order.id, entryIndex, { status: updatedStatus }))
        .then((order) => {
          expect(order.entries[entryIndex].status).to.equal(updatedStatus);
        });
    });
  });

  describe('addOrder', () => {
    beforeEach(() => {
      return Item({
        name: 'Rice',
        price: 1000,
        category: 'Side',
        type: 'TYPE'
      }).save();
    });

    it('saves table number and entries', () => {
      const tableNumber = '10';
      return Item.findOne({ name: 'Rice' })
      .then((item) => Order.addOrder(tableNumber, [item]))
      .then((order) => {
        expect(order.tableNumber).to.equal(tableNumber);
        expect(order.entries[0].createdAt).to.exist;
        expect(order.entries[0].name).to.equal('Rice');
        expect(order.entries[0].category).to.equal('Side');
        expect(order.entries[0].type).to.equal('TYPE');
      });
    });
  });

  it ('updateStatus', () => {
    return Order({ id: 1 }).save()
    .then(() => Order.updateStatus(1, constants.READY_FOR_BILL))
    .then(() => Order.findOne({ id: 1 }))
    .then((order) => {
      expect(order.status).to.equal(constants.READY_FOR_BILL);
    });
  });

  it ('updateTableNumber', () => {
    return Order({ id: 1 }).save()
    .then(() => Order.updateTableNumber(1, '20'))
    .then(() => Order.findOne({ id: 1 }))
    .then((order) => {
      expect(order.tableNumber).to.equal('20');
    });
  });

  it.only('saveDiscounts', () => {
    return Discount({ value: 0.5 }).save()
    .then(() => Order({ id: 1 }).save())
    .then(() => Discount.findOne({ value: 0.5 }))
    .then((discount) => Order.saveDiscounts(1, discount))
    .then(() => Order.getOrders())
    .then(([order]) => {
      expect(order.discounts[0].value).to.equal(0.5);
    });
  });

  it ('setClosed', () => {
    const amounts = {
      cash: 1500,
      credit: 2000,
      tip: 800
    };

    return Order({ id: 1 }).save()
      .then((order) => Transaction.addTransaction(order.id, amounts))
      .then((transaction) => Order.setClosed(1, transaction._id))
      .then((order) => {
        expect(order.transaction.cash).to.equal(amounts.cash);
        expect(order.transaction.credit).to.equal(amounts.credit);
        expect(order.transaction.tip).to.equal(amounts.tip);
      });
  });
});
