const INITIAL_STATE = {};

function setState(state, newState) {
  return Object.assign({}, state, newState);
}

function toggleOrder(state, id) {
  const orders = state.orders;
  const orderIndex = orders.findIndex((order) => {
    return order.id === id;
  });
  const order = orders[orderIndex];
  const status = order.status === 'open' ? 'closed' : 'open';

  return Object.assign({}, state, {
    orders: [
      ...orders.slice(0, orderIndex),
      Object.assign({}, orders[orderIndex], { status }),
      ...orders.slice(orderIndex + 1)
    ]
  });
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case 'SET_STATE':
    return setState(state, action.state);
  case 'TOGGLE_ORDER':
    return toggleOrder(state, action.id);
  }
  return state;
}
