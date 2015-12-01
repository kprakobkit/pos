import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import $ from '../../src/money';
import PaymentComponent from '../../src/components/Payment';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;
const Payment = React.createFactory(PaymentComponent);

function setup() {
  const startingBalance = 2000;
  const setClosed = () => {};
  const component = renderIntoDocument(Payment({ startingBalance, setClosed }));

  return {
    component,
    startingBalance
  };
}

describe('Payment', () => {
  const setClosed = () => {};

});


