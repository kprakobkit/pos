import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import OrdersComponent from '../../src/components/Orders';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass
} = TestUtils;

const Orders = React.createFactory(OrdersComponent);

describe('Orders', () => {
  const toggleOrder = () => {};

  it('renders title', () => {
    const component = renderIntoDocument(Orders({ orders: [], toggleOrder: toggleOrder }));
    const title = findRenderedDOMComponentWithClass(component, 'orders-title');

    expect(title.textContent).to.equal('Orders');
  });

  it('renders Order component for each order in props', () => {
    const order1 = { id: 1, status: 'open' };
    const order2 = { id: 2, status: 'open' };
    const order3 = { id: 3, status: 'open' };
    const ordersProp = [order1, order2, order3];
    const component = renderIntoDocument(Orders({ orders: ordersProp, toggleOrder: toggleOrder }));
    const children = scryRenderedDOMComponentsWithClass(component, 'order');

    expect(children.length).to.equal(3);
  });

  it('renders message if there are no orders', () => {
    const component = renderIntoDocument(Orders({ orders: [], toggleOrder: toggleOrder }));
    const ordersComponent = findRenderedDOMComponentWithClass(component, 'orders-message');

    expect(ordersComponent.textContent).to.equal('There are currently no orders.');
  });
});
