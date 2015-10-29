import mongoose from 'mongoose';
import constants from '../src/constants';
import Order from '../models/order';

export function setState(state) {
  return {
    type: constants.SET_STATE,
    state
  };
}

export function toggleOrder(id) {
  return {
    type: constants.TOGGLE_ORDER,
    id
  };
}

export function loadOrders() {
  return (dispatch) => {
    return Order.find()
      .then((response) => {
        const orders = response.map(toOrder);
        dispatch(setState({ orders }));
      });
  };
}

function toOrder({ id, status }) {
  return { id, status };
}

export default {
  setState,
  toggleOrder,
  loadOrders
};
