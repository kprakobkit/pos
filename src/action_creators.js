export function setState(state) {
  return {
    type: 'SET_STATE',
    state
  };
}

export function toggleOrder(orderId) {
  return {
    type: 'TOGGLE_ORDER',
    orderId: orderId
  };
}
