import actions from './action_creators';
import constants from '../src/constants';

export default (store) => (socket) => {
  socket.on(constants.TOGGLE_ORDER, (action) => store.dispatch(actions.toggleOrder(action.id)));
  socket.on(constants.LOAD_ORDERS, (action) => store.dispatch(actions.loadOrders()));
};
