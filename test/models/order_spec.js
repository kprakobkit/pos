import utils from '../utils';
import Order from '../../models/order';
import Item from '../../models/item';
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

  describe('get entries', () => {
    beforeEach(() => {
      return Item({
        name: 'Rice',
        price: 1000
      }).save();
    });

    it('adds createdAt to each entry', () => {
      return Item.findOne({ name: 'Rice' })
      .then((item) => Order.addOrder([item]))
      .then((order) => {
        expect(order.entries[0].createdAt).to.exist;
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
});
