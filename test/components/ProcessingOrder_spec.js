import { expect, spy } from 'chai';
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

function setup({ discounts = [], status = 'READY_FOR_BILL' } = {}) {
  const price = 1025;
  const props = {
    order: {
      status, id: 1, entries: [
        Generator.entry().name('delivered').status(constants.DELIVERED).price(price).build(),
        Generator.entry().name('delivered').status(constants.DELIVERED).price(price).build(),
        Generator.entry().name('delivered').status(constants.CANCELED).price(price).build(),
        Generator.entry().status(constants.CLOSED).price(price).build(),
        Generator.entry().status(constants.CANCELED).price(100).build()
      ],
      discounts
    },
    setClosed: spy(),
    setReadyForBill: spy(),
    saveDiscounts: spy(),
    discounts: []
  };

  const component = renderIntoDocument(ProcessingOrder(props));

  return {
    subtotal: findRenderedDOMComponentWithClass(component, 'order-subtotal'),
    tax: findRenderedDOMComponentWithClass(component, 'order-tax'),
    total:  findRenderedDOMComponentWithClass(component, 'order-total'),
    price,
    component
  };
}

describe('ProcessingOrder', () => {
  it('renders only delivered entries', () => {
    const { component } = setup();
    const orderEntries = scryRenderedDOMComponentsWithClass(component, 'order-entry');
    const entryNames = scryRenderedDOMComponentsWithClass(component, 'entry-name');

    expect(orderEntries.length).to.equal(1);
    expect(entryNames[0].textContent).to.contain('delivered');
  });

  it('renders subtotal, tax, and total for all delivered entries', () => {
    const { component, price, tax, subtotal, total } = setup();
    const expectedSubtotal = price * 2;
    expect(subtotal.textContent).to.contain($.format(expectedSubtotal));
    expect(tax.textContent).to.contain($.format(expectedSubtotal * constants.TAX_RATE));
    expect(total.textContent).to.contain($.format(expectedSubtotal * (1 + constants.TAX_RATE)));
  });

  it('quantiy and total for each uniq entry', () => {
    const { component, price } = setup();
    const quantities = scryRenderedDOMComponentsWithClass(component, 'entry-quantity');
    const entryTotal = scryRenderedDOMComponentsWithClass(component, 'entry-total');

    expect(quantities[0].textContent).to.contain('2');
    expect(entryTotal[0].textContent).to.equal($.format(2 * price));
  });

  describe('discounts', () => {
    it('shows the discount button', () => {
      const { component } = setup();
      const applyDiscount = scryRenderedDOMComponentsWithClass(component, 'apply-discount');

      expect(applyDiscount.length).to.equal(1);
    });

    it('does not show the discount button when order is closed', () => {
      const { component } = setup({ status: constants.CLOSED });
      const applyDiscount = scryRenderedDOMComponentsWithClass(component, 'apply-discount');

      expect(applyDiscount.length).to.equal(0);
    });

    it('does not show discount when there is none', () => {
      const { component } = setup();
      const discount = scryRenderedDOMComponentsWithClass(component, 'order-discount');
      expect(discount.length).to.equal(0);
    });

    it('renders discount, subtotal, and total', () => {
      const discounts = [Generator.discount().value(0.4).build()];
      const { component, subtotal, price } = setup({ discounts });
      const discount = findRenderedDOMComponentWithClass(component, 'order-discount');
      const expectedDiscount = price * 2 * 0.4;
      const expectedSubtotal = price * 2 * 0.6;

      expect(discount.textContent).to.contain($.format(expectedDiscount));
      expect(subtotal.textContent).to.contain($.format(expectedSubtotal));
    });
  });
});

