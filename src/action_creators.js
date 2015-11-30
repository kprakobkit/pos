import constants from '../src/constants';

export function setState(state) {
  return {
    type: constants.SET_STATE,
    state
  };
}

export function loadOrders() {
  return {
    meta: { remote: true },
    type: constants.LOAD_ORDERS
  };
}

export function loadItems() {
  return {
    meta: { remote: true },
    type: constants.LOAD_ITEMS
  };
}

export function addOrder(entries) {
  return {
    meta: { remote: true },
    type: constants.ADD_ORDER,
    entries: entries
  };
}

export function addEntriesToOrder(orderId, entries) {
  return {
    meta: { remote: true },
    type: constants.ADD_ENTRIES_TO_ORDER,
    entries,
    orderId
  };
}


export function changeEntryStatus(orderId, entryIndex, status) {
  return {
    meta: { remote: true },
    type: constants.CHANGE_ENTRY_STATUS,
    orderId,
    entryIndex,
    status
  };
}

export function setReadyForBill(orderId) {
  return {
    meta: { remote: true },
    type: constants.SET_READY_FOR_BILL,
    orderId
  };
}

export function setOpen(orderId) {
  return {
    meta: { remote: true },
    type: constants.SET_OPEN,
    orderId
  };
}

export function closeOrder(orderId, cashAmount, creditAmount, creditTipAmount) {
  return {
    meta: { remote: true },
    type: constants.CLOSE_ORDER,
    orderId,
    cashAmount,
    creditAmount,
    creditTipAmount
  };
}

export default {
  setState,
  loadOrders,
  loadItems,
  addOrder,
  changeEntryStatus,
  addEntriesToOrder,
  setReadyForBill,
  setOpen,
  closeOrder
};
