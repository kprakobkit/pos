import * as constants from '../src/constants';

export function toggleOrder(id) {
  return {
    meta: { remote: true },
    type: constants.TOGGLE_ORDER,
    id
  };
}

export function loadOrders() {
  return (dispatch, getState) => {
    setTimeout(() => dispatch(toggleOrder(2)), 1000);
    // return Order.find({}, (err, orders) => {
    //   dispatch(setState({ orders }));
    // });
  };
}
