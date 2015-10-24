import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Order from '../../src/components/Order';

const { renderIntoDocument, findRenderedDOMComponentWithClass } = TestUtils;
const order = React.createFactory(Order);

describe('Order', () => {
  const id = 1;
  const status = 'open';
  const orderProps = { id: id, status: status };
  const component = renderIntoDocument(order(orderProps));

  it('renders id', () => {
    const orderId = findRenderedDOMComponentWithClass(component, 'order-number');

    expect(orderId.textContent).to.equal(id.toString());
  });

  it('renders status', () => {
    const orderStatus = findRenderedDOMComponentWithClass(component, 'order-status');

    expect(orderStatus.textContent).to.equal(status);
  });
});
