import constants from '../../../src/constants';

const OrderStub = {
  find: () => {
    return {
      populate: () => {
        return Promise.resolve([]);
      }
    };
  },

  addOrder: (tableNumber, entries) => {
    return Promise.resolve({
      tableNumber,
      entries
    });
  },

  getOrders: () => {
    return Promise.resolve([]);
  },

  remove: () => {
    return Promise.resolve([]);
  },

  updateTableNumber: (orderId, tableNumber) => {
    return Promise.resolve({
      id: orderId,
      tableNumber,
      entries: []
    });
  },

  saveDiscounts: (orderId, discounts) => {
    return Promise.resolve({
      id: orderId,
      discounts,
      entries: []
    });
  },

  findOneAndUpdate: ({ id }, { status }) => {
    return Promise.resolve({ id, status });
  },

  updateEntry: (orderId, entryIndex, { status }) => {
    return Promise.resolve(
      {
        id: orderId,
        status: constants.OPEN,
        entries: [{ status, name: '', comment: '' }]
      }
    );
  },
  updateStatus: (orderId, status) => {
    return Promise.resolve(
      {
        id: orderId,
        status: status,
        entries: []
      }
    );
  },
  setClosed: (orderId, transaction) => {
    return Promise.resolve(
      {
        id: orderId,
        status: constants.CLOSED,
        transaction: {
          id: '1234',
          cash: 1000,
          credit: 1000,
          tip: 500
        },
        entries: []
      }
    );
  }
};

export default OrderStub;
