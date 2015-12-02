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
  it('renders subtotal for all delivered entries', () => {
    const price = 1025;
    const props = {
      order: {
        status: 'open', id: 1, entries: [
          Generator.entry().status(constants.DELIVERED).price(price).build(),
          Generator.entry().status(constants.CANCELED).price(100).build()
        ]
      },
      setClosed: () => {},
      setReadyForBill: () => {}
    };
    const component = renderIntoDocument(ProcessingOrder(props));
    const subtotal = findRenderedDOMComponentWithClass(component, 'order-subtotal');

    expect(subtotal.textContent).to.contain($.format(price));
  });
});

