import utils from '../utils';
import Order from '../../models/order';
import Item from '../../models/item';
import Transaction from '../../models/transaction';
import { expect } from 'chai';
import faker from 'faker';
import constants from '../../src/constants';

describe('Order', () => {
  it ('defautls to OPEN status', function () {
    return Order().save()
    .then((newOrder) => {
      expect(newOrder.status).to.equal(constants.OPEN);
    });
  });

  describe('add order', () => {
    beforeEach(() => {
      return Item({
        name: 'Rice',
        price: 1000
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
      });
    });
  });

  it ('updateStatus', function () {
    return Order({ id: 1 }).save()
    .then(() => Order.updateStatus(1, constants.READY_FOR_BILL))
    .then(() => Order.findOne({ id: 1 }))
    .then((order) => {
      expect(order.status).to.equal(constants.READY_FOR_BILL);
    });
  });

  it ('setClosed', function () {
    const amounts = {
      cash: 1500,
      credit: 2000,
      tip: 800
    };

    return Order({ id: 1 }).save()
      .then((order) => Transaction.addTransaction(order.id, amounts))
      .then((transaction) => Order.setClosed(1, transaction._id))
      .then((order) => {
        expect(order.transaction).to.deep.equal(amounts);
      });
  });
});
