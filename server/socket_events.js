import actions from './action_creators';
import constants from '../src/constants';

export default (store) => (socket) => {
  socket.on(constants.LOAD_ORDERS, (action) => store.dispatch(actions.loadOrders()));

  socket.on(constants.LOAD_ITEMS, (action) => store.dispatch(actions.loadItems()));

  socket.on(constants.ADD_ORDER, (action) => store.dispatch(actions.addOrder(action.entries)));

  socket.on(constants.CHANGE_ENTRY_STATUS, (action) => store.dispatch(actions.changeEntryStatus(action.orderId, action.entryIndex, action.status)));

  socket.on(constants.ADD_ENTRIES_TO_ORDER, (action) => store.dispatch(actions.addEntriesToOrder(action.orderId, action.entries)));

  socket.on(constants.SET_READY_FOR_PAYMENT, (action) => store.dispatch(actions.setReadyForPayment(action.orderId)));
};
