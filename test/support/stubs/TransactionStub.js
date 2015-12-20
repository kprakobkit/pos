import _ from 'underscore';

const TransactionStub = {
  find: () => {
    return Promise.resolve([]);
  },

  addTransaction: (orderId, transaction) => {
    return Promise.resolve(_.extend({}, transaction, { _id: transaction.id }));
  },

  findOneAndUpdate: (transactionId, transaction) => {
    return Promise.resolve(_.extend({}, transaction, { _id: transaction.id }));
  }
};

export default TransactionStub;
