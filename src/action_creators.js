import constants from '../src/constants';

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
  return {
    meta: { remote: true },
    type: constants.LOAD_ORDERS
  };
}

export default {
  setState,
  toggleOrder,
  loadOrders
};
