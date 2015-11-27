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
  return transactAndDispatch(orderId, Order.updateEntry(orderId, entryIndex, { status }));
}

export function addEntriesToOrder(orderId, newEntries) {
  return transactAndDispatch(orderId, Order.addEntries(orderId, newEntries));
}

export function setReadyForBill(orderId) {
  return transactAndDispatch(orderId, Order.updateStatus(orderId, constants.READY_FOR_BILL));
}

function transactAndDispatch(orderId, transaction) {
  return (dispatch, getState) => {
    const orders = getState().orders;
    const orderIndex = orders.findIndex((order) => order.id === orderId);

    return transaction
      .then((response) => {
        const updatedOrders = [
          ...orders.slice(0, orderIndex),
          response,
          ...orders.slice(orderIndex + 1)
        ];

        dispatch(setState({ orders: updatedOrders }));
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
