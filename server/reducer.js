import constants from '../src/constants';
import _ from 'ramda';

const INITIAL_STATE = {
  isLoading: true
};

function setState(state, newState) {
  return _.merge(state, newState);
}

function updateOrder(state, { orderId, order }) {
  const orders = state.orders;
  const orderIndex = _.findIndex(_.propEq('id', orderId), orders);
  const updatedOrders = _.update(orderIndex, order, state.orders);

  return _.merge(state, { orders: updatedOrders });
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case constants.SET_STATE:
      return setState(state, action.state);
    case constants.UPDATE_ORDER:
      return updateOrder(state, action);
    case constants.IS_LOADING:
      return setState(state, { isLoading: true });
    default:
      return state;
  }
}
