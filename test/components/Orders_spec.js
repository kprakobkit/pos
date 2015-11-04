import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import OrdersComponent from '../../src/components/Orders';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const Orders = React.createFactory(OrdersComponent);

describe('Orders', () => {
  const toggleOrder = () => {};
  const loadOrders = () => {};

  it('renders title', () => {
    const component = renderIntoDocument(Orders({ orders: [], toggleOrder, loadOrders }));
    const title = findRenderedDOMComponentWithClass(component, 'orders-title');

    expect(title.textContent).to.equal('Orders');
  });

  it('renders Order component for each order in props', () => {
    const order1 = { id: '1', status: constants.OPEN };
    const order2 = { id: '2', status: constants.OPEN };
    const order3 = { id: '3', status: constants.OPEN };
    const orders = [order1, order2, order3];
    const component = renderIntoDocument(Orders({ orders, toggleOrder, loadOrders }));
    const children = scryRenderedDOMComponentsWithClass(component, 'order');

    expect(children.length).to.equal(3);
  });

  it('renders message if there are no orders', () => {
    const component = renderIntoDocument(Orders({ orders: [], toggleOrder, loadOrders }));
    const ordersComponent = findRenderedDOMComponentWithClass(component, 'orders-message');

    expect(ordersComponent.textContent).to.equal('There are currently no orders.');
  });

  it('displays orders based on filter', () => {
    const order1 = { id: '1', status: constants.OPEN };
    const order2 = { id: '2', status: constants.OPEN };
    const order3 = { id: '3', status: constants.CLOSED };
    const orders = [order1, order2, order3];
    const component = renderIntoDocument(Orders({ orders, toggleOrder, loadOrders }));
    const filter = findRenderedDOMComponentWithClass(component, 'orders-filter-open');
    Simulate.click(filter);
    const children = scryRenderedDOMComponentsWithClass(component, 'order');

    expect(children.length).to.equal(2);
    expect(children[0].textContent).to.contain(constants.OPEN);
    expect(children[1].textContent).to.contain(constants.OPEN);
  });
});
