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

function setup({ transaction } = {}) {
  const startingBalance = 2000;
  const setClosed = () => {};
  const component = renderIntoDocument(Payment({ startingBalance, transaction, setClosed }));

  return {
    component,
    transaction,
    startingBalance
  };
}

describe('Payment', () => {
  const setClosed = () => {};

  it('renders balance remaining after entered amounts', () => {
    const { component, startingBalance } = setup();
    const balance = findRenderedDOMComponentWithClass(component, 'payment-balance-amount');
    const input = findRenderedDOMComponentWithClass(component, 'cash-amount-input');

    expect(balance.textContent).to.contain($.format(startingBalance));

    const amount = 5;
    input.value = amount;
    Simulate.change(input);

    expect(balance.textContent).to.contain($.format(startingBalance - $.cents(amount)));
  });

  it('does not include credit tip amount when calculating remaining balance', () => {
    const { component, startingBalance } = setup();
    const balance = findRenderedDOMComponentWithClass(component, 'payment-balance-amount');
    const input = findRenderedDOMComponentWithClass(component, 'cash-amount-input');
    const tipInput = findRenderedDOMComponentWithClass(component, 'tip-amount-input');

    expect(balance.textContent).to.contain($.format(startingBalance));

    const amount = 5;
    tipInput.value = amount;
    Simulate.change(tipInput);

    input.value = 0;
    Simulate.change(input);

    expect(balance.textContent).to.contain($.format(startingBalance));
  });
});


