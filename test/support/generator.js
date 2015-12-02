import constants from '../../src/constants';
import faker from 'faker';
import _ from 'underscore';
import moment from 'moment';

const orderStatuses = [
  constants.OPEN,
  constants.CLOSED,
  constants.READY_FOR_BILL
];

function builderFromDefault(defaultObject) {
  let builder = {
    build: () => defaultObject
  };

  Object.keys(defaultObject).forEach((prop) => {
    builder[prop] = (override) => {
      defaultObject[prop] = override;
      return builder;
    };
  });

  return builder;
}

function orderBuilder() {
  const defaultOrder = {
    id: faker.random.number().toString(),
    status: _.sample(orderStatuses),
    transaction: transactionBuilder().build(),
    entries: [entryBuilder().build()],
    tableNumber: faker.random.number().toString().slice(0, 1)
  };

  return builderFromDefault(defaultOrder);
}

function entryBuilder() {
  const defaultEntry = {
    name: 'rice',
    price: 1050,
    comment: 'brown rice',
    status: _.sample(orderStatuses),
    createdAt: moment(constants.now)
  };

  return builderFromDefault(defaultEntry);;
}

function transactionBuilder() {
  const defaultTransaction = {
    orderId: '1',
    cash: 1500,
    credit: 1000,
    tip: 500
  };

  return builderFromDefault(defaultTransaction);
}

export default {
  order: orderBuilder,
  entry: entryBuilder
};
