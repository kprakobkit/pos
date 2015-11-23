import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import ProcessingOrderComponent from '../../src/components/ProcessingOrder';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass
} = TestUtils;
const ProcessingOrder = React.createFactory(ProcessingOrderComponent);

describe('ProcessingOrder', () => {
  it('renders subtotal for all delivered entries', () => {
    const props = {
      order: {
        status: 'open', id: 1, entries: [
          { name: 'Pho', status: constants.DELIVERED, price: 1025 },
          { name: 'Rice', status: constants.CANCELED, price: 125 }
        ]
      }
    };
    const component = renderIntoDocument(ProcessingOrder(props));
    const subtotal = findRenderedDOMComponentWithClass(component, 'order-subtotal');

    expect(subtotal.textContent).to.contain('$10.25');
  });
});

