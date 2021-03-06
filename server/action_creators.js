import mongoose from 'mongoose';
import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import Transaction from '../models/transaction';
import Discount from '../models/discount';

function isLoading() {
  return {
    type: constants.IS_LOADING
  };
}

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

export function getInitialState() {
  return (dispatch, getState) => {
    const getItems = () => Item.find().sort('category');
    const getDiscounts = () => Discount.find();

    return Promise.all([Order.getOrders(), getItems(), getDiscounts()]).then(([orders, items, discounts]) => {
      dispatch(setState({
        orders,
        items,
        discounts,
        isLoading: false
      }));
    });
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
    return Item.find().sort('category').then((response) => {
      const items = response.map(toMasterItem);

      dispatch(setState({
        items
      }));
    });
  };
}

export function loadDiscounts() {
  return (dispatch) => {
    return Discount.find().then((discounts) => {
      dispatch(setState({
        discounts
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

export function addOrder(tableNumber, entries, onSuccess) {
  return (dispatch, getState) => {
    return Order.addOrder(tableNumber, entries)
    .then((order) => {
      const updatedOrders = getState().orders.concat(order);

      dispatch(setState({
        orders: updatedOrders
      }));

      onSuccess(order.id);
    });
  };
}

export function removeOrder(id) {
  return (dispatch, getState) => {
    return Order.remove({ id })
    .then(() => {
      const updatedOrders = getState().orders.filter((order) => order.id != id);

      dispatch(setState({
        orders: updatedOrders
      }));
    });
  };
}

export function setClosed(orderId, transactionId, amounts) {
  const addOrUpdateTransaction = transactionId ?
    Transaction.findOneAndUpdate({ _id: transactionId, orderId }, amounts, { new: true }) :
    Transaction.addTransaction(orderId, amounts);

  const transaction = addOrUpdateTransaction
    .then((transaction) => Order.setClosed(orderId, transaction._id));

  return dispatchUpdateOrder(orderId, transaction);
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

export function updateTableNumber(orderId, tableNumber) {
  return dispatchUpdateOrder(orderId, Order.updateTableNumber(orderId, tableNumber));
}

export function saveDiscounts(orderId, discounts) {
  return dispatchUpdateOrder(orderId, Order.saveDiscounts(orderId, discounts));
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
  getInitialState
};
