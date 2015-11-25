import mongoose from 'mongoose';
import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import faker from 'faker';
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
    Order({
      id: faker.random.number(), // need auto generated id...
      entries: entries.map((item) => ({
        item_id: mongoose.Types.ObjectId(item.id),
        comment: item.comment
      }))
    })
    .save()
    .then(() => {
      Order.getOrders().then((orders) => {
        dispatch(setState({
          orders: updatedOrders
        }));
      });
    });
  };
}

export function changeEntryStatus(orderId, entryIndex, status) {
  return (dispatch, getState) => {
    const orders = getState().orders;
    const orderIndex = orders.findIndex((order) => order.id === orderId);

    return Order.updateEntry(orderId, entryIndex, { status })
      .then((response) => {
        const updatedOrders = [
          ...orders.slice(0, orderIndex),
          response[0],
          ...orders.slice(orderIndex + 1)
        ];

        dispatch(setState({ orders: updatedOrders }));
      });
  };
}

export function addEntriesToOrder(orderId, newEntries) {
  return (dispatch, getState) => {
    return Order.addEntries(orderId, newEntries).then(() => {
      return Order.getOrders();
    }).then((orders) => {
      dispatch(setState({ orders }));
    });
  };
}

export function setReadyForBill(orderId) {
  return (dispatch, getState) => {
    const orders = getState().orders;
    const orderIndex = orders.findIndex((order) => order.id === orderId);

    return Order.updateStatus(orderId, constants.READY_FOR_BILL)
    .then((response) => {
      const updatedOrders = [
        ...orders.slice(0, orderIndex),
        response,
        ...orders.slice(orderIndex + 1)
      ];

      dispatch(setState({ orders: updatedOrders }));
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
