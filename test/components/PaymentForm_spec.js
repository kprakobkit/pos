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
    creditInput: findRenderedDOMComponentWithClass(component, 'credit-amount-input'),
    tipInput: findRenderedDOMComponentWithClass(component, 'tip-amount-input'),
    closeOrderButton: findRenderedDOMComponentWithClass(component, 'close-order'),
    startingBalance
  };
}

describe('PaymentForm', () => {
  const setClosed = () => {};

  it('prefills input fields with zero if no existing transaction amounts', () => {
    const { component, creditInput, tipInput } = setup();

    expect(creditInput.attributes.placeholder.value).to.eq('0');
    expect(tipInput.attributes.placeholder.value).to.eq('0');
  });

  it('prefills input fields with existing transaction amounts', () => {
    const cash = 1000;
    const credit = 2000;
    const tip = 500;
    const existing = { cash, credit, tip };
    const { component, creditInput, tipInput, startingBalance } = setup(existing);

    expect(creditInput.attributes.placeholder.value).to.eq($.dollars(credit).toString());
    expect(tipInput.attributes.placeholder.value).to.eq($.dollars(tip).toString());
  });

  it('disables close order button if credit payment exceeds order total', () => {
    const credit = 999999;
    const { closeOrderButton } = setup({ credit });

    expect(closeOrderButton.disabled).to.be.true;
  });
});
