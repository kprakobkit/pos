import actions from './action_creators';
import constants from '../src/constants';

export default (store) => (socket) => {
  socket.on(constants.LOAD_ORDERS, (action) => store.dispatch(actions.loadOrders()));

  socket.on(constants.LOAD_ITEMS, (action) => store.dispatch(actions.loadItems()));

  socket.on(constants.LOAD_DISCOUNTS, (action) => store.dispatch(actions.loadDiscounts()));

  socket.on(constants.LOAD_TRANSACTIONS, (action) => store.dispatch(actions.loadTransactions()));

  socket.on(constants.ADD_ORDER, (action) => {
    const onSuccess = (orderId) => {
      socket.emit(constants.ADD_ORDER_SUCCESS, orderId);
    };
    store.dispatch(actions.addOrder(action.tableNumber, action.entries, onSuccess));
  });

  socket.on(constants.CHANGE_ENTRY_STATUS, (action) => store.dispatch(actions.changeEntryStatus(action.orderId, action.entryIndex, action.status)));

  socket.on(constants.ADD_ENTRIES_TO_ORDER, (action) => store.dispatch(actions.addEntriesToOrder(action.orderId, action.entries)));

  socket.on(constants.SET_READY_FOR_BILL, (action) => store.dispatch(actions.setReadyForBill(action.orderId)));

  socket.on(constants.SET_OPEN, (action) => store.dispatch(actions.setOpen(action.orderId)));

  socket.on(constants.SET_CLOSED, (action) => {
    store.dispatch(actions.setClosed(action.orderId, action.transactionId, action.amounts));
  });

  socket.on(constants.REMOVE_ORDER, (action) => store.dispatch(actions.removeOrder(action.orderId)));

  socket.on(constants.UPDATE_TABLE_NUMBER, (action) => store.dispatch(actions.updateTableNumber(action.orderId, action.tableNumber)));
};
