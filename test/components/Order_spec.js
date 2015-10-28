import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import OrderComponent from '../../src/components/Order';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;
const Order = React.createFactory(OrderComponent);

describe('Order', () => {
  const id = 1;
  const status = 'open';
  const toggleOrder = () => {};

  it('renders id', () => {
    const props = { id, status, toggleOrder };
    const component = renderIntoDocument(Order(props));
    const orderId = findRenderedDOMComponentWithClass(component, 'order-number');

    expect(orderId.textContent).to.contain(id.toString());
  });

  it('renders status', () => {
    const props = { id, status, toggleOrder };
    const component = renderIntoDocument(Order(props));
    const orderStatus = findRenderedDOMComponentWithClass(component, 'order-status');

    expect(orderStatus.textContent).to.contain(status);
  });

  it('calls callback when button clicked', () => {
    let toggleOrderCalled = false;
    const toggleOrderStub = () => toggleOrderCalled = true;
    const props = { id, status, toggleOrder: toggleOrderStub };
    const component = renderIntoDocument(Order(props));
    const button = findRenderedDOMComponentWithClass(component, 'order-status-toggle');

    Simulate.click(button);

    expect(toggleOrderCalled).to.be.true;
  });
});
