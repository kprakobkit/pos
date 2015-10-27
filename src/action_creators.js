export function setState(state) {
  return {
    type: 'SET_STATE',
    state
  };
}

export function toggleOrder(id) {
  return {
    meta: { remote: true },
    type: 'TOGGLE_ORDER',
    id
  };
}
