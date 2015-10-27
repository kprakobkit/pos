import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Order from '../../src/components/Order';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;
const order = React.createFactory(Order);

describe('Order', () => {
  const id = 1;
  const status = 'open';
  const toggleOrder = () => {};

  it('renders id', () => {
    const orderProps = { id: id, status: status, toggleOrder: toggleOrder };
    const component = renderIntoDocument(order(orderProps));
    const orderId = findRenderedDOMComponentWithClass(component, 'order-number');

    expect(orderId.textContent).to.contain(id.toString());
  });

  it('renders status', () => {
    const orderProps = { id: id, status: status, toggleOrder: toggleOrder };
    const component = renderIntoDocument(order(orderProps));
    const orderStatus = findRenderedDOMComponentWithClass(component, 'order-status');

    expect(orderStatus.textContent).to.contain(status);
  });

  it('calls callback when button clicked', () => {
    let toggleOrderCalled = false;
    const toggleOrderStub = () => toggleOrderCalled = true;
    const orderProps = { id: id, status: status, toggleOrder: toggleOrderStub };
    const component = renderIntoDocument(order(orderProps));
    const button = findRenderedDOMComponentWithClass(component, 'order-status-toggle');

    Simulate.click(button);

    expect(toggleOrderCalled).to.be.true;
  });
});
