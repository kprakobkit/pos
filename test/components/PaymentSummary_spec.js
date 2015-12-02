import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import $ from '../../src/money';
import PaymentSummaryComponent from '../../src/components/PaymentSummary';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass
} = TestUtils;
const PaymentSummary = React.createFactory(PaymentSummaryComponent);

function setup({ cash = 0, credit = 0, tip = 0 } = {}) {
  const setReadyForBill = () => {};
  const component = renderIntoDocument(PaymentSummary({ cash, credit, tip, setReadyForBill }));

  return { component };
}

describe('PaymentSummary', () => {
  const setClosed = () => {};

  it('renders payment amounts from existing transaction amounts', () => {
    const cash = 1000;
    const credit = 2000;
    const tip = 500;
    const existing = { cash, credit, tip };
    const { component } = setup(existing);
    const cashPaid = findRenderedDOMComponentWithClass(component, 'cash-amount-paid');
    const creditPaid = findRenderedDOMComponentWithClass(component, 'credit-amount-paid');
    const tipPaid = findRenderedDOMComponentWithClass(component, 'tip-amount-paid');

    expect(cashPaid.textContent).to.eq($.format(cash));
    expect(creditPaid.textContent).to.eq($.format(credit));
    expect(tipPaid.textContent).to.eq($.format(tip));
  });
});


