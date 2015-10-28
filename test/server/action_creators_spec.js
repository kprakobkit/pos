import { expect } from 'chai';
import proxyquire from 'proxyquire';
import * as constants from '../../src/constants';

const Order = {
  find: () => {
    return Promise.resolve([]);
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
    const id = 1;
    const expected = {
      type: constants.TOGGLE_ORDER,
      id
    };

    expect(actions.toggleOrder(id)).to.deep.equal(expected);
  });

  it('loadOrders', () => {
    let called = false;
    function dispatch() {
      called = true;
    }

    actions.loadOrders()(dispatch).then(() => {
      expect(called).to.be.true;
    });
  });
});
