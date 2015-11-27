import utils from '../utils';
import Order from '../../models/order';
import Item from '../../models/item';
import { expect } from 'chai';
import faker from 'faker';
import constants from '../../src/constants';

describe('Order', () => {
  it ('defautls to OPEN status', function (done) {
    Order({
      id: faker.random.number()
    }).save((err, newOrder) => {
      expect(newOrder.status).to.equal(constants.OPEN);
      done();
    });
  });

  describe('get entries', (done) => {
    beforeEach((done) => {
      Item({
        name: 'Rice',
        price: 1000
      }).save(done);
    });

    it('adds createdAt to each entry', (done) => {
      Item.findOne({ name: 'Rice' })
      .then((item) => Order.addOrder([item]))
      .then((order) => {
        expect(order.entries[0].createdAt).to.exist;
        done();
      });
    });
  });

  it ('updateStatus', function (done) {
    Order({
      id: faker.random.number()
    }).save((err, newOrder) => {
      Order.updateStatus(newOrder.id, constants.READY_FOR_BILL).then(() => {
        Order.findOne({ id: newOrder.id }).then((order) => {
          expect(order.status).to.equal(constants.READY_FOR_BILL);
          done();
        });
      });
    });
  });
});
