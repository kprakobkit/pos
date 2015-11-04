import constants from '../src/constants';

const INITIAL_STATE = {};

function setState(state, newState) {
  return Object.assign({}, state, newState);
}

function addOrder(state, order) {
  const newState = {
    orders: state.orders.concat(order)
  };

  return Object.assign({}, state, newState);
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case constants.SET_STATE:
    return setState(state, action.state);
  case constants.ADD_ORDER:
    return addOrder(state, action.order);
  }

  return state;
}
