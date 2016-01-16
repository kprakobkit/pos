import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Generator from '../support/generator';
import constants from '../../src/constants';
import $ from '../../src/money';
import ProcessingOrderComponent from '../../src/components/ProcessingOrder';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;
const ProcessingOrder = React.createFactory(ProcessingOrderComponent);

describe('ProcessingOrder', () => {
  const price = 1025;
  const props = {
    order: {
      status: 'open', id: 1, entries: [
        Generator.entry().name('delivered').status(constants.DELIVERED).price(price).build(),
        Generator.entry().name('delivered').status(constants.DELIVERED).price(price).build(),
        Generator.entry().name('delivered').status(constants.CANCELED).price(price).build(),
        Generator.entry().status(constants.CLOSED).price(price).build(),
        Generator.entry().status(constants.CANCELED).price(100).build()
      ]
    },
    setClosed: () => {},
      setReadyForBill: () => {}
  };
  const component = renderIntoDocument(ProcessingOrder(props));
  const subtotal = findRenderedDOMComponentWithClass(component, 'order-subtotal');
  const tax = findRenderedDOMComponentWithClass(component, 'order-tax');
  const total = findRenderedDOMComponentWithClass(component, 'order-total');

  it('renders only delivered entries', () => {
    const orderEntries = scryRenderedDOMComponentsWithClass(component, 'order-entry');
    const entryNames = scryRenderedDOMComponentsWithClass(component, 'entry-name');

    expect(orderEntries.length).to.equal(1);
    expect(entryNames[0].textContent).to.contain('delivered');
  });

  it('renders subtotal, tax, and total for all delivered entries', () => {
    const expectedSubtotal = price * 2;
    expect(subtotal.textContent).to.contain($.format(expectedSubtotal));
    expect(tax.textContent).to.contain($.format(expectedSubtotal * constants.TAX_RATE));
    expect(total.textContent).to.contain($.format(expectedSubtotal * (1 + constants.TAX_RATE)));
  });

  it('quantiy and total for each uniq entry', () => {
    const quantities = scryRenderedDOMComponentsWithClass(component, 'entry-quantity');
    const entryTotal = scryRenderedDOMComponentsWithClass(component, 'entry-total');

    expect(quantities[0].textContent).to.contain('2');
    expect(entryTotal[0].textContent).to.equal($.format(2 * price));
  });
});

