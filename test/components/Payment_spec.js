import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Generator from '../support/generator';
import constants from '../../src/constants';
import PaymentComponent from '../../src/components/Payment';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;
const Payment = React.createFactory(PaymentComponent);

describe('Payment', () => {
  const setClosed = () => {};

  it('renders balance remaining after entered amounts', () => {
    const price = 2000;
    const props = { startingBalance: price, setClosed };
    const component = renderIntoDocument(Payment(props));
    const balance = findRenderedDOMComponentWithClass(component, 'payment-balance-amount');
    const input = findRenderedDOMComponentWithClass(component, 'cash-amount-input');

    expect(balance.textContent).to.contain(`$${(price / 100).toFixed(2)}`);

    const amount = 5;
    input.value = amount;
    Simulate.change(input);

    expect(balance.textContent).to.contain(`$${((price - amount * 100) / 100).toFixed(2)}`);
  });

  it('does not include credit tip amount when calculating remaining balance', () => {
    const price = 2000;
    const props = { startingBalance: price, setClosed };
    const component = renderIntoDocument(Payment(props));
    const balance = findRenderedDOMComponentWithClass(component, 'payment-balance-amount');
    const input = findRenderedDOMComponentWithClass(component, 'cash-amount-input');
    const tipInput = findRenderedDOMComponentWithClass(component, 'tip-amount-input');

    expect(balance.textContent).to.contain(`$${(price / 100).toFixed(2)}`);

    const amount = 5;
    tipInput.value = amount;
    Simulate.change(tipInput);

    input.value = 0;
    Simulate.change(input);

    expect(balance.textContent).to.contain(`$${(price / 100).toFixed(2)}`);
  });
});


