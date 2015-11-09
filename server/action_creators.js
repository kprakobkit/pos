import mongoose from 'mongoose';
import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';
import faker from 'faker';
import Promise from 'promise';

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
    return getOrders()
    .then(getEntries)
    .then((orders) => {
      return dispatch(setState({
        orders
      }));
    }).catch((e) => {
      throw new Error(e.stack);
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

function getOrders() {
  return new Promise((resolve, reject) => {
    Order.find().exec((err, orders) => {
      if(err) {
        reject(err);
      }

      resolve(orders.map(toOrder));
    });
  });
}

function populateEntries(order) {
  return new Promise((resolve, reject) => {
    Item.populate(order.entries, [{ path: 'item_id', model: 'Item', select: 'name price -_id' }], (err, res) => {
      if(err) {
        reject(err);
      }

      resolve(res);
    });
  });
}

function getEntries(orders) {
  return Promise.all(orders.map(populateEntries)).then((entries) => {
    orders.forEach((order, index) => {
      order.entries = entries[index].map(toEntry);
    });

    return orders;
  });
}

function toOrder({ id, status, entries }) {
  return {
    id,
    status,
    entries: entries
  };
}

function toMasterItem({ _id, name, price }) {
  return { id: _id, name, price };
}

function toEntry({ status, comment, item_id }) {
  return {
    status,
    comment,
    name: item_id.name,
    price: item_id.price
  };
}

export default {
  setState,
  toggleOrder,
  loadOrders,
  loadItems,
  addOrder
};
