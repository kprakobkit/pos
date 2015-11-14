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

  getOrders: () => {
    return Promise.resolve([]);
  },

  findOneAndUpdate: ({ id }, { status }) => {
    return Promise.resolve({ id, status });
  },

  updateEntry: (orderId, entryIndex, { status }) => {
    return Promise.resolve(
      [
        {
          id: orderId,
          status: constants.OPEN,
          entries: [{ status, name: '', comment: '' }]
        }
      ]
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
      done();
    });
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

  xit('addOrder', () => {
    let dispatched;
    function dispatch(action) {
      dispatched = action;
    }
    const getState = () => {
      return { orders: [] };
    };
    const items = [{ name: 'food' }];
    const expected = {
      type: constants.SET_STATE,
      state: {
        orders: [
          { id: 1, status: constants.OPEN, items }
        ]
      }
    };

    actions.addOrder(items)(dispatch).then(() => {
      expect(dispatched).to.deep.equal(expected);
      done();
    });
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
      type: constants.SET_STATE,
      state: {
        orders: [
          {
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
        ]
      }
    };

    actions.changeEntryStatus(1, 0, constants.DELIVERED)(dispatch, getState).then(() => {
      expect(dispatched).to.deep.equal(expected);
      done();
    });
  });
});
