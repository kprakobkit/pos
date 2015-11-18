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

export default {
  order: orderBuilder
};
