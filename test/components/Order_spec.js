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

  it('renders id', () => {
    const orderProps = { id: id, status: status };
    const component = renderIntoDocument(order(orderProps));
    const orderId = findRenderedDOMComponentWithClass(component, 'order-number');

    expect(orderId.textContent).to.equal(id.toString());
  });

  it('renders status', () => {
    const orderProps = { id: id, status: status };
    const component = renderIntoDocument(order(orderProps));
    const orderStatus = findRenderedDOMComponentWithClass(component, 'order-status');

    expect(orderStatus.textContent).to.equal(status);
  });

  it('calls callback when button clicked', () => {
    let toggleOrderCalled = false;
    const toggleOrder = () => toggleOrderCalled = true;
    const orderProps = { id: id, status: status, toggleOrder: toggleOrder };
    const component = renderIntoDocument(order(orderProps));
    const button = findRenderedDOMComponentWithClass(component, 'order-status-toggle');

    Simulate.click(button);

    expect(toggleOrderCalled).to.be.true;
  });
});
