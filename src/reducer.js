import { List, Map } from 'immutable';

const INITIAL_STATE = Map();

function setState(state, newState) {
  return state.merge(newState);
}

function toggleOrder(state, orderId) {
  const orders = state.get('orders');
  const orderIndex = orders.findIndex((order) => {
    return order.get('id') === orderId;
  });

  return state.updateIn(
    ['orders'],
    orders,
    (orders) => orders.update(
      orderIndex,
      (order) => order.updateIn(
        ['status'],
        'open',
        (status) => status === 'open' ? 'closed' : 'open'
      )
    ));
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case 'SET_STATE':
    return setState(state, action.state);
  case 'TOGGLE_ORDER':
    return toggleOrder(state, action.orderId);
  }
  return state;
}
