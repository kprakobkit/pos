import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Generator from '../support/generator';
import constants from '../../src/constants';
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

  it('prefills input fields with zero if no existing transaction amounts', () => {
    const { component } = setup();
    const balance = findRenderedDOMComponentWithClass(component, 'payment-balance-amount');
    const cashInput = findRenderedDOMComponentWithClass(component, 'cash-amount-input');
    const creditInput = findRenderedDOMComponentWithClass(component, 'credit-amount-input');
    const tipInput = findRenderedDOMComponentWithClass(component, 'tip-amount-input');

    expect(cashInput.value).to.eq($.dollars(0));
    expect(creditInput.value).to.eq($.dollars(0));
    expect(tipInput.value).to.eq($.dollars(0));
  });

  it('prefills input fields with existing transaction amounts', () => {
    const cash = 1000;
    const credit = 2000;
    const tip = 500;
    const existing = { cash, credit, tip };
    const { component, transaction, startingBalance } = setup({ transaction: existing });
    const balance = findRenderedDOMComponentWithClass(component, 'payment-balance-amount');
    const cashInput = findRenderedDOMComponentWithClass(component, 'cash-amount-input');
    const creditInput = findRenderedDOMComponentWithClass(component, 'credit-amount-input');
    const tipInput = findRenderedDOMComponentWithClass(component, 'tip-amount-input');

    expect(cashInput.value).to.eq($.dollars(cash));
    expect(creditInput.value).to.eq($.dollars(credit));
    expect(tipInput.value).to.eq($.dollars(tip));
  });
});


