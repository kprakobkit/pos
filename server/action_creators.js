import mongoose from 'mongoose';
import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import Transaction from '../models/transaction';

export function setState(state) {
  return {
    type: constants.SET_STATE,
    state
  };
}

export function updateOrder(orderId, order) {
  return {
    type: constants.UPDATE_ORDER,
    orderId,
    order
  };
}

export function loadOrders() {
  return (dispatch) => {
    return Order.getOrders().then((orders) => {
      dispatch(setState({
        orders
      }));
    });
  };
}

export function loadItems() {
  return (dispatch) => {
    return Item.find().then((response) => {
      const items = response.map(toMasterItem);

      dispatch(setState({
        items
      }));
    });
  };
}

export function loadTransactions() {
  return (dispatch) => {
    return Transaction.getTransactions().then((transactions) => {
      dispatch(setState({ transactions }));
    });
  };
}

export function addOrder(tableNumber, entries) {
  return (dispatch, getState) => {
    return Order.addOrder(tableNumber, entries)
    .then((order) => {
      const updatedOrders = getState().orders.concat(order);

      dispatch(setState({
        orders: updatedOrders
      }));
    });
  };
}

export function changeEntryStatus(orderId, entryIndex, status) {
  return dispatchUpdateOrder(orderId, Order.updateEntry(orderId, entryIndex, { status }));
}

export function addEntriesToOrder(orderId, newEntries) {
  return dispatchUpdateOrder(orderId, Order.addEntries(orderId, newEntries));
}

export function setReadyForBill(orderId) {
  return dispatchUpdateOrder(orderId, Order.updateStatus(orderId, constants.READY_FOR_BILL));
}

export function setOpen(orderId) {
  return dispatchUpdateOrder(orderId, Order.updateStatus(orderId, constants.OPEN));
}

export function setClosed(orderId, transactionId, amounts) {
  const addOrUpdateTransaction = transactionId ?
    Transaction.findOneAndUpdate(transactionId, amounts, { new: true }) :
    Transaction.addTransaction(orderId, amounts);

  const transaction = addOrUpdateTransaction
    .then((transaction) => Order.setClosed(orderId, transaction._id));

  return dispatchUpdateOrder(orderId, transaction);
}

function dispatchUpdateOrder(orderId, transaction) {
  return (dispatch, getState) => {
    return transaction
      .then((order) => {
        dispatch(updateOrder(orderId, order));
      }, (e) => {
        throw new Error(e);
      });
  };
}

function toMasterItem({ _id, name, price, category }) {
  return { id: _id, name, price, category };
}

function toOrder({ id, status, entries }) {
  return {
    id,
    status,
    entries
  };
}

export default {
  setState,
  loadOrders,
  loadItems,
  loadTransactions,
  addOrder,
  changeEntryStatus,
  addEntriesToOrder,
  setReadyForBill,
  setOpen,
  setClosed
};
