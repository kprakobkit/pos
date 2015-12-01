import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import $ from '../../src/money';
import PaymentFormComponent from '../../src/components/PaymentForm';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;
const PaymentForm = React.createFactory(PaymentFormComponent);

function setup({ cash = 0, credit = 0, tip = 0 } = {}) {
  const startingBalance = 2000;
  const setClosed = () => {};
  const component = renderIntoDocument(PaymentForm({
    startingBalance,
    cash,
    credit,
    tip,
    setClosed
  }));

  return {
    component,
    balance: findRenderedDOMComponentWithClass(component, 'payment-balance-amount'),
    cashInput: findRenderedDOMComponentWithClass(component, 'cash-amount-input'),
    creditInput: findRenderedDOMComponentWithClass(component, 'credit-amount-input'),
    tipInput: findRenderedDOMComponentWithClass(component, 'tip-amount-input'),
    startingBalance
  };
}

describe('PaymentForm', () => {
  const setClosed = () => {};

  it('renders balance remaining after entered amounts', () => {
    const { component, balance, cashInput, startingBalance } = setup();

    expect(balance.textContent).to.contain($.format(startingBalance));

    const amount = 5;
    cashInput.value = amount;
    Simulate.change(cashInput);

    expect(balance.textContent).to.contain($.format(startingBalance - $.cents(amount)));
  });

  it('does not include credit tip amount when calculating remaining balance', () => {
    const { component, balance, cashInput, tipInput, startingBalance } = setup();

    expect(balance.textContent).to.contain($.format(startingBalance));

    const amount = 5;
    tipInput.value = amount;
    Simulate.change(tipInput);

    cashInput.value = 0;
    Simulate.change(cashInput);

    expect(balance.textContent).to.contain($.format(startingBalance));
  });

  it('prefills input fields with zero if no existing transaction amounts', () => {
    const { component, balance, cashInput, creditInput, tipInput } = setup();

    expect(cashInput.value).to.eq($.dollars(0));
    expect(creditInput.value).to.eq($.dollars(0));
    expect(tipInput.value).to.eq($.dollars(0));
  });

  it('prefills input fields with existing transaction amounts', () => {
    const cash = 1000;
    const credit = 2000;
    const tip = 500;
    const existing = { cash, credit, tip };
    const { component, balance, cashInput, creditInput, tipInput, startingBalance } = setup(existing);

    expect(cashInput.value).to.eq($.dollars(cash));
    expect(creditInput.value).to.eq($.dollars(credit));
    expect(tipInput.value).to.eq($.dollars(tip));
  });
});


