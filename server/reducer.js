import constants from '../src/constants';
import _ from 'underscore';

const INITIAL_STATE = {};

function setState(state, newState) {
  return _.extend({}, state, newState);
}

function updateOrder(state, { orderId, order }) {
  const orders = state.orders;
  const orderIndex = orders.findIndex((order) => order.id === orderId);
  const updatedOrders = [
    ...orders.slice(0, orderIndex),
    order,
    ...orders.slice(orderIndex + 1)
  ];

  return _.extend({}, state, { orders: updatedOrders });
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case constants.SET_STATE:
      return setState(state, action.state);
    case constants.UPDATE_ORDER:
      return updateOrder(state, action);
    default:
      return state;
  }
}
