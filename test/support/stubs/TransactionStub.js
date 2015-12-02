import _ from 'underscore';

const TransactionStub = {
  addTransaction: (orderId, transaction) => {
    return Promise.resolve(_.extend({}, transaction, { _id: transaction.id }));
  },

  findOneAndUpdate: (transactionId, transaction) => {
    return Promise.resolve(_.extend({}, transaction, { _id: transaction.id }));
  }
};

export default TransactionStub;
