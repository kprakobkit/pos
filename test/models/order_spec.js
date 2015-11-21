import utils from '../utils';
import Order from '../../models/order';
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
});
