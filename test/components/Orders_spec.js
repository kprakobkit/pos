import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import OrdersComponent from '../../src/components/Orders';
import Generator from '../support/generator';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const Orders = React.createFactory(OrdersComponent);

describe('Orders', () => {
  const loadOrders = () => {};
  const loadItems = () => {};

  it('renders Order component for each order in props', () => {
    const order1 = Generator.order().status(constants.OPEN).build();
    const order2 = Generator.order().status(constants.OPEN).build();
    const orders = [order1, order2];
    const component = renderIntoDocument(Orders({ orders, loadOrders, loadItems }));
    const children = scryRenderedDOMComponentsWithClass(component, 'order');

    expect(children.length).to.equal(2);
  });

  it('renders message if there are no orders', () => {
    const component = renderIntoDocument(Orders({ orders: [], loadOrders, loadItems }));
    const ordersComponent = findRenderedDOMComponentWithClass(component, 'orders-message');

    expect(ordersComponent.textContent).to.equal('There are currently no orders.');
  });

  it('displays orders based on filter', () => {
    const order1 = Generator.order().status(constants.OPEN).build();
    const order2 = Generator.order().status(constants.CLOSED).build();
    const orders = [order1, order2];
    const component = renderIntoDocument(Orders({ orders, loadOrders, loadItems }));
    const filter = findRenderedDOMComponentWithClass(component, 'orders-filter-open');
    Simulate.click(filter);
    const children = scryRenderedDOMComponentsWithClass(component, 'order');
    const expectedStatus = constants.OPEN.toLowerCase();

    expect(children.length).to.equal(1);
    expect(children[0].textContent).to.contain(expectedStatus);
  });
});
