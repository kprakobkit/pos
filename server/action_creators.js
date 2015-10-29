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
  return (dispatch, getState) => {
    const orders = getState().orders;
    const orderIndex = orders.findIndex((order) => order.id === id);
    const order = orders[orderIndex];
    const status = order.status === 'open' ? 'closed' : 'open';

    return Order.findOneAndUpdate({ id }, { status }, { new: true })
      .then((response) => {
        const updatedOrders = [
            ...orders.slice(0, orderIndex),
            toOrder(response),
            ...orders.slice(orderIndex + 1)
        ];
        dispatch(setState({ orders: updatedOrders }));
      });
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
