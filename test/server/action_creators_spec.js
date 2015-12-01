import { expect } from 'chai';
import proxyquire from 'proxyquire';
import constants from '../../src/constants';
import mongoose from 'mongoose';

mongoose.models = {};

const Order = {
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
          cash: 1000,
          credit: 1000,
          tip: 500
        },
        entries: []
      }
    );
  }
};

const Item = {
  find: () => {
    return Promise.resolve([]);
  }
};

const actions = proxyquire('../../server/action_creators', {
  '../models/order': Order,
  '../models/item': Item
});

describe('server action creators', () => {
  it('setState', () => {
    const state = {};
    const expected = {
      type: constants.SET_STATE,
      state
    };

    expect(actions.setState(state)).to.deep.equal(expected);
  });

  it('loadOrders', (done) => {
    let dispatched;
    function dispatch(action) {
      dispatched = action;
    }
    const expected = {
      type: constants.SET_STATE,
      state: {
        orders: []
      }
    };

    actions.loadOrders()(dispatch).then(() => {
      expect(dispatched).to.deep.equal(expected);
    }).then(done, done);
  });

  it('loadItems', (done) => {
    let dispatched;
    function dispatch(action) {
      dispatched = action;
    }
    const expected = {
      type: constants.SET_STATE,
      state: {
        items: []
      }
    };

    actions.loadItems()(dispatch).then(() => {
      expect(dispatched).to.deep.equal(expected);
      done();
    });
  });

  it('addOrder', (done) => {
    let dispatched;
    function dispatch(action) {
      dispatched = action;
    }
    const getState = () => {
      return { orders: []  };
    };
    const entries = [{ name: 'food' }];
    const expected = {
      type: constants.SET_STATE,
      state: {
        orders: [
          { entries, tableNumber: '14' }
        ]
      }
    };

    actions.addOrder('14', entries)(dispatch, getState).then(() => {
      expect(dispatched).to.deep.equal(expected);
    }).then(done, done);
  });

  it('changeEntryStatus', (done) => {
    let dispatched;
    const orders = [
      {
        id: 1,
        status: constants.OPEN,
        entries: [
          {
            id: 2,
            status: constants.OPEN,
            name: '',
            comment: ''
          }
        ]
      }
    ];
    function dispatch(action) {
      dispatched = action;
    }
    function getState() {
      return { orders };
    }
    const expected = {
      type: constants.UPDATE_ORDER,
      orderId: 1,
      order: {
        id: 1,
        status: constants.OPEN,
        entries: [
          {
            status: constants.DELIVERED,
            name: '',
            comment: ''
          }
        ]
      }
    };

    actions.changeEntryStatus(1, 0, constants.DELIVERED)(dispatch, getState).then(() => {
      expect(dispatched).to.deep.equal(expected);
    }).then(done, done);
  });

  it('setReadyForBill', (done) => {
    let dispatched;
    const orders = [
      {
        id: 1,
        status: constants.OPEN,
        entries: []
      }
    ];
    function dispatch(action) {
      dispatched = action;
    }
    function getState() {
      return { orders };
    }
    const expected = {
      type: constants.UPDATE_ORDER,
      orderId: 1,
      order: {
        id: 1,
        status: constants.READY_FOR_BILL,
        entries: []
      }
    };

    actions.setReadyForBill(1)(dispatch, getState).then(() => {
      expect(dispatched).to.deep.equal(expected);
    }).then(done, done);
  });

  it('setOpen', (done) => {
    let dispatched;
    const orders = [
      {
        id: 1,
        status: constants.READY_FOR_BILL,
        entries: []
      }
    ];
    function dispatch(action) {
      dispatched = action;
    }
    function getState() {
      return { orders };
    }
    const expected = {
      type: constants.UPDATE_ORDER,
      orderId: 1,
      order: {
        id: 1,
        status: constants.OPEN,
        entries: []
      }
    };

    actions.setOpen(1)(dispatch, getState).then(() => {
      expect(dispatched).to.deep.equal(expected);
    }).then(done, done);
  });

  it('setClosed', (done) => {
    let dispatched;

    const orders = [
      {
        id: 1,
        status: constants.READY_FOR_BILL,
        entries: []
      }
    ];

    function dispatch(action) {
      dispatched = action;
    }

    function getState() {
      return { orders };
    }

    const amounts = {
      cash: 1000,
      credit: 1000,
      tip: 500
    };

    const expected = {
      type: constants.UPDATE_ORDER,
      orderId: 1,
      order: {
        id: 1,
        status: constants.CLOSED,
        transaction: amounts,
        entries: []
      }
    };

    actions.setClosed(1, amounts)(dispatch, getState).then(() => {
      expect(dispatched).to.deep.equal(expected);
    }).then(done, done);
  });
});
