import { expect, spy } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import moment from 'moment';
import _ from 'ramda';
import $ from '../../src/money';
import Generator from '../support/generator';
import ReportingPaymentsComponent from '../../src/components/ReportingPayments';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const ReportingPayments = React.createFactory(ReportingPaymentsComponent);

function setup() {
  const today = moment().startOf('day');
  const transaction = Generator.transaction().build();
  const transactions = _.repeat(transaction, 2);
  const component = renderIntoDocument(ReportingPayments({ transactions }));

  return {
    headerRow: findRenderedDOMComponentWithClass(component, 'reporting-payments-header'),
    creditRow: findRenderedDOMComponentWithClass(component, 'reporting-payments-credit'),
    cashRow: findRenderedDOMComponentWithClass(component, 'reporting-payments-cash'),
    totalRow: findRenderedDOMComponentWithClass(component, 'reporting-payments-total'),
    lookbackSelect: findRenderedDOMComponentWithClass(component, 'reporting-payments-lookback-select'),
    transaction,
    component
  };
}

describe('ReportingPayments', () => {
  it('renders header, credit, cash, and total rows', () => {
    const { headerRow, creditRow, cashRow, totalRow, component } = setup();

    expect(headerRow).to.exist;
    expect(creditRow).to.exist;
    expect(cashRow).to.exist;
    expect(totalRow).to.exist;
  });

  it('renders correct totals', () => {
    const { totalRow, transaction } = setup();
    const expectedTotal = transaction.total * 2;

    expect(totalRow.textContent).to.contain($.format(expectedTotal));
  });

  it('displays the correct lookback period based on selection', () => {
    const { lookbackSelect, component } = setup();
    const lookbackDays = 14;
    let dateHeaders = scryRenderedDOMComponentsWithClass(component, 'reporting-payments-date-header');

    expect(dateHeaders.length).to.equal(7);

    Simulate.change(lookbackSelect, { target: { value: lookbackDays } });

    dateHeaders = scryRenderedDOMComponentsWithClass(component, 'reporting-payments-date-header');

    expect(dateHeaders.length).to.equal(lookbackDays);
  });
});
