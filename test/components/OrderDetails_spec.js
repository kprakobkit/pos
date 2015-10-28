import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import OrderDetailsComponent from '../../src/components/OrderDetails';

const { renderIntoDocument, findRenderedDOMComponentWithClass } = TestUtils;
const OrderDetails = React.createFactory(OrderDetailsComponent);

describe('OrderDetails', () => {
  const id = 1;
  const params = { id };
  const props = { params };

  it('renders title with correct order number from params', () => {
    const component = renderIntoDocument(OrderDetails(props));
    const title = findRenderedDOMComponentWithClass(component, 'order-title');

    expect(title.textContent).to.contain(id.toString());
  });
});

