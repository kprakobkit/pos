import constants from '../../src/constants';
import faker from 'faker';
import _ from 'underscore';

const orderStatuses = [
  constants.OPEN,
  constants.CLOSED,
  constants.READY_FOR_BILL
];

function orderBuilder() {
  const defaultOrder = {
    id: faker.random.number().toString(),
    status: _.sample(orderStatuses)
  };

  return {
    status: function (status) {
      defaultOrder.status = status;
      return this;
    },
    build: function () {
      return defaultOrder;
    }
  };
}

function entryBuilder() {
  const defaultEntry = {
    name: 'rice',
    price: 1050,
    comment: 'brown rice',
    status: _.sample(orderStatuses)
  };

  return {
    status: function (status) {
      defaultEntry.status = status;
      return this;
    },
    build: function () {
      return defaultEntry;
    }
  };
}

export default {
  order: orderBuilder,
  entry: entryBuilder
};
