import { expect } from 'chai';
import proxyquire from 'proxyquire';
import constants from '../../src/constants';
import mongoose from 'mongoose';

mongoose.models = {};

const Order = {
  find: () => {
    return Promise.resolve([]);
  },

  findOneAndUpdate: ({ id }, { status }) => {
    return Promise.resolve({ id, status });
  }
};

const actions = proxyquire('../../server/action_creators', { '../models/order': Order });

describe('server action creators', () => {
  it('setState', () => {
    const state = {};
    const expected = {
      type: constants.SET_STATE,
      state
    };

    expect(actions.setState(state)).to.deep.equal(expected);
  });

  it('toggleOrder', () => {
    let dispatched;
    const orders = [
      { id: 1, status: constants.CLOSED },
      { id: 2, status: constants.OPEN },
      { id: 3, status: constants.CLOSED }
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
          { id: 1, status: constants.CLOSED },
          { id: 2, status: constants.CLOSED },
          { id: 3, status: constants.CLOSED }
        ]
      }
    };

    actions.toggleOrder(2)(dispatch, getState).then(() => {
      expect(dispatched).to.deep.equal(expected);
      done();
    });
  });

  it('loadOrders', (done) => {
    let dispatched;
    function dispatch(action) {
      dispatched = action;
    }
    const expected = {
      type: constants.SET_STATE,
      state: { orders: [] }
    };

    actions.loadOrders()(dispatch).then(() => {
      expect(dispatched).to.deep.equal(expected);
      done();
    });
  });
});