import mongoose from 'mongoose';
import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import Entry from '../models/entry';
import faker from 'faker';
import _ from 'underscore';

export function setState(state) {
  return {
    type: constants.SET_STATE,
    state
  };
}

export function toggleOrder(id) {
  return (dispatch, getState) => {
    const orders = getState().orders;
    const orderIndex = orders.findIndex((order) => order.id === id);
    const order = orders[orderIndex];
    const status = order.status === constants.OPEN ? constants.CLOSED : constants.OPEN;

    return Order.findOneAndUpdate({ id }, { status }, { new: true })
      .then((response) => {
        const updatedOrders = [
          ...orders.slice(0, orderIndex),
          toOrder(response),
          ...orders.slice(orderIndex + 1)
        ];
        dispatch(setState({ orders: updatedOrders }));
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
    }).save((err, newOrder) => {
      const updatedOrders = getState().orders.concat(newOrder);

      dispatch(setState({
        orders: updatedOrders
      }));
    });
  };
}

export function changeEntryStatus(orderId, entryIndex, status) {
  return (dispatch, getState) => {
    const orders = getState().orders;
    const orderIndex = orders.findIndex((order) => order.id === orderId);
    const order = orders[orderIndex];
    const entries = order.entries;
    const entry = entries[entryIndex];
    const updatedEntries = [
      ...entries.slice(0, entryIndex),
      _.extend({}, entry, { status }),
      ...entries.slice(entryIndex + 1)
    ];

    return Order.findOneAndUpdate({ id: orderId }, { entries: updatedEntries }, { new: true })
      .then((response) => {
        const updatedOrders = [
          ...orders.slice(0, orderIndex),
          toOrder(response),
          ...orders.slice(orderIndex + 1)
        ];

        dispatch(setState({
          orders: updatedOrders
        }));
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
    entries: entries
  };
}

function toEntry({ id, name, status, comment }) {
  return { id, name, status, comment };
}

export default {
  setState,
  toggleOrder,
  loadOrders,
  loadItems,
  addOrder,
  changeEntryStatus
};
