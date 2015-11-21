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

export function setReadyForPayment(orderId) {
  return {
    meta: { remote: true },
    type: constants.SET_READY_FOR_PAYMENT,
    orderId
  };
}

export default {
  setState,
  loadOrders,
  loadItems,
  addOrder,
  changeEntryStatus,
  addEntriesToOrder,
  setReadyForPayment
};
