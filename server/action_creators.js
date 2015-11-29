import mongoose from 'mongoose';
import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import _ from 'underscore';

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

export function addOrder(entries) {
  return (dispatch, getState) => {
    Order.addOrder(entries)
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

function toMasterItem({ _id, name, price }) {
  return { id: _id, name, price };
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
  addOrder,
  changeEntryStatus,
  addEntriesToOrder,
  setReadyForBill
};
