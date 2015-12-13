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
    expect(subtotal.textContent).to.contain($.format(price));
    expect(tax.textContent).to.contain($.format(price * constants.TAX_RATE));
    expect(total.textContent).to.contain($.format(price * (1 + constants.TAX_RATE)));
  });
});

