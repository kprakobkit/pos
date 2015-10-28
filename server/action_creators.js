import mongoose from 'mongoose';
import * as constants from '../src/constants';
import Order from '../models/order';

export function setState(state) {
  return {
    type: constants.SET_STATE,
    state
  };
}

export function toggleOrder(id) {
  return {
    meta: { remote: true },
    type: constants.TOGGLE_ORDER,
    id
  };
}

export function loadOrders() {
  return (dispatch, getState) => {
    return Order.find({}, (err, response) => {
      let orders = response.map((order) => {
        return {
          id: order.id,
          status: order.status
        };
      });
      dispatch(setState({ orders }));
    });
  };
}
