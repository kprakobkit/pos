import mongoose from 'mongoose';
import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';

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
    return Order.find()
    .populate('items')
    .then((response) => {
      const orders = response.map(toOrder);

      dispatch(setState({
        orders
      }));
    });
  };
}

export function loadItems() {
  return (dispatch) => {
    return Item.find().then((response) => {
      const items = response.map(toItem);

      dispatch(setState({
        items
      }));
    });
  };
}

function toOrder({ id, status, items }) {
  return {
    id,
    status,
    items: items.map(toItem)
  };
}

function toItem({ _id, name, price }) {
  return { id: _id, name, price };
}

export default {
  setState,
  toggleOrder,
  loadOrders,
  loadItems
};
