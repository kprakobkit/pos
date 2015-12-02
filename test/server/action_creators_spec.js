import { expect } from 'chai';
import proxyquire from 'proxyquire';
import constants from '../../src/constants';
import Order from '../support/stubs/OrderStub';
import Item from '../support/stubs/ItemStub';
import Transaction from '../support/stubs/TransactionStub';
import mongoose from 'mongoose';

mongoose.models = {};

const actions = proxyquire('../../server/action_creators', {
  '../models/order': Order,
  '../models/item': Item,
  '../models/transaction': Transaction
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
        transaction: transaction,
        entries: []
      }
    ];

    function dispatch(action) {
      dispatched = action;
    }

    function getState() {
      return { orders };
    }

    const transaction = {
      id: '1234',
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
        transaction: transaction,
        entries: []
      }
    };

    actions.setClosed(1, '1234', transaction)(dispatch, getState).then(() => {
      expect(dispatched).to.deep.equal(expected);
    }).then(done, done);
  });
});
