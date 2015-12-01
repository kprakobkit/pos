import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import $ from '../../src/money';
import PaymentComponent from '../../src/components/Payment';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;
const Payment = React.createFactory(PaymentComponent);

function setup({ orderStatus } = { orderStatus: constants.READY_FOR_BILL }) {
  const startingBalance = 2000;
  const setClosed = () => {};
  const component = renderIntoDocument(Payment({ startingBalance, orderStatus, setClosed }));

  return {
    component,
    startingBalance
  };
}

describe('Payment', () => {
  it('renders payment form when order is ready for bill', () => {
    const { component } = setup({ orderStatus: constants.READY_FOR_BILL });
    const paymentForm = findRenderedDOMComponentWithClass(component, 'payment-form');

    expect(paymentForm).to.exist;
  });

  it('renders payment summary when order is closed', () => {
    const { component } = setup({ orderStatus: constants.CLOSED });
    const paymentForm = findRenderedDOMComponentWithClass(component, 'payment-summary');

    expect(paymentForm).to.exist;
  });
});
