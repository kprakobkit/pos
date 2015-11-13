import actions from './action_creators';
import constants from '../src/constants';

export default (store) => (socket) => {
  socket.on(constants.TOGGLE_ORDER, (action) => store.dispatch(actions.toggleOrder(action.id)));

  socket.on(constants.LOAD_ORDERS, (action) => store.dispatch(actions.loadOrders()));

  socket.on(constants.LOAD_ITEMS, (action) => store.dispatch(actions.loadItems()));

  socket.on(constants.ADD_ORDER, (action) => store.dispatch(actions.addOrder(action.entries)));

  socket.on(constants.CHANGE_ENTRY_STATUS, (action) => {
    store.dispatch(actions.changeEntryStatus(action.orderId, action.entryId, action.status));
  });
};
