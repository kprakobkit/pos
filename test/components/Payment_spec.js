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
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;
const Payment = React.createFactory(PaymentComponent);

describe('Payment', () => {
  const setClosed = () => {};

  it('renders balance remaining after entered amounts', () => {
    const price = 20;
    const props = { startingBalance: price, setClosed };
    const component = renderIntoDocument(Payment(props));
    const balance = findRenderedDOMComponentWithClass(component, 'payment-balance-amount');
    const input = scryRenderedDOMComponentsWithClass(component, 'payment-amount-input')[0];

    expect(balance.textContent).to.contain(`$${(price).toFixed(2)}`);

    const amount = 5;
    input.value = amount;
    Simulate.change(input);

    expect(balance.textContent).to.contain(`$${(price - amount).toFixed(2)}`);
  });

  it('does not include credit tip amount when calculating remaining balance', () => {
    const price = 20;
    const props = { startingBalance: price, setClosed };
    const component = renderIntoDocument(Payment(props));
    const balance = findRenderedDOMComponentWithClass(component, 'payment-balance-amount');
    const input = scryRenderedDOMComponentsWithClass(component, 'payment-amount-input')[0];
    const tipInput = findRenderedDOMComponentWithClass(component, 'tip-amount-input');

    expect(balance.textContent).to.contain(`$${price.toFixed(2)}`);

    const amount = 5;
    tipInput.value = amount;
    Simulate.change(tipInput);

    input.value = 0;
    Simulate.change(input);

    expect(balance.textContent).to.contain(`$${price.toFixed(2)}`);
  });
});


