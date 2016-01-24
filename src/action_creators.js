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

export function loadDiscounts() {
  return {
    meta: { remote: true },
    type: constants.LOAD_DISCOUNTS
  };
}

export function loadTransactions() {
  return {
    meta: { remote: true },
    type: constants.LOAD_TRANSACTIONS
  };
}

export function addOrder(tableNumber, entries, onSuccess) {
  return {
    meta: { remote: true },
    type: constants.ADD_ORDER,
    entries,
    tableNumber,
    onReceipt: {
      type: constants.ADD_ORDER_SUCCESS,
      onSuccess
    }
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

export function setClosed(orderId, transactionId, amounts) {
  return {
    meta: { remote: true },
    type: constants.SET_CLOSED,
    orderId,
    transactionId,
    amounts
  };
}

export function removeOrder(orderId) {
  return {
    meta: { remote: true },
    type: constants.REMOVE_ORDER,
    orderId
  };
}

export function updateTableNumber(orderId, tableNumber) {
  return {
    meta: { remote: true },
    type: constants.UPDATE_TABLE_NUMBER,
    orderId,
    tableNumber
  };
}

export function saveDiscounts(orderId, discounts) {
  return {
    meta: { remote: true },
    type: constants.SAVE_DISCOUNTS,
    orderId,
    discounts
  };
}

export function login(pin) {
  return {
    type: constants.LOGIN,
    pin
  };
}

export function logout() {
  return {
    type: constants.LOGOUT
  };
}

export function setUser({ user, token }) {
  return {
    type: constants.SET_USER,
    user,
    token
  };
}

export default {
  setState,
  loadOrders,
  loadItems,
  loadDiscounts,
  loadTransactions,
  addOrder,
  changeEntryStatus,
  addEntriesToOrder,
  setReadyForBill,
  setOpen,
  setClosed,
  removeOrder,
  updateTableNumber,
  saveDiscounts,
  login,
  setUser,
  logout
};
