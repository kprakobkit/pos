import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import $ from '../../src/money';
import PaymentFormComponent from '../../src/components/PaymentForm';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass
} = TestUtils;
const PaymentForm = React.createFactory(PaymentFormComponent);

function setup({ cash, credit, tip } = { cash: 0, credit: 0, tip: 0 }) {
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
    startingBalance
  };
}

describe('PaymentForm', () => {
  const setClosed = () => {};

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
    const { component, startingBalance } = setup(existing);
    const balance = findRenderedDOMComponentWithClass(component, 'payment-balance-amount');
    const cashInput = findRenderedDOMComponentWithClass(component, 'cash-amount-input');
    const creditInput = findRenderedDOMComponentWithClass(component, 'credit-amount-input');
    const tipInput = findRenderedDOMComponentWithClass(component, 'tip-amount-input');

    expect(cashInput.value).to.eq($.dollars(cash));
    expect(creditInput.value).to.eq($.dollars(credit));
    expect(tipInput.value).to.eq($.dollars(tip));
  });
});


