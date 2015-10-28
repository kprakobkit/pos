import * as actionCreators from '../src/action_creators';
import * as constants from '../src/constants';

export default (store) => (socket) => {
  socket.on(constants.TOGGLE_ORDER, (action) => store.dispatch(actionCreators.toggleOrder(action.id)));
  socket.on(constants.LOAD_ORDERS, (action) => store.dispatch(actionCreators.getOrders()));
};
