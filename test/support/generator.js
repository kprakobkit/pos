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
    id: function (id) {
      defaultOrder.id = id;
      return this;
    },
    entries: function (entries) {
      defaultOrder.entries = entries;
      return this;
    },
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
    name: function (name) {
      defaultEntry.name = name;
      return this;
    },
    status: function (status) {
      defaultEntry.status = status;
      return this;
    },
    price: function (price) {
      defaultEntry.price = price;
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
