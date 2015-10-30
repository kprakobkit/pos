import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import OrdersFilterComponent from '../../src/components/OrdersFilter';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const OrdersFilter = React.createFactory(OrdersFilterComponent);

describe('OrdersFilter', () => {
  it('renders three filter options', () => {
    const component = renderIntoDocument(OrdersFilter());
    const filters = scryRenderedDOMComponentsWithClass(component, 'orders-filter-option');

    expect(filters.length).to.equal(3);
    expect(filters[0].className).to.contain('orders-filter-all');
    expect(filters[1].className).to.contain('orders-filter-open');
    expect(filters[2].className).to.contain('orders-filter-ready');
  });

  it('calls handler to filter orders', () => {
    let calledWithAll = false;
    let calledWithOpen = false;
    let calledWithReady = false;
    const filterOrders = (filter) => {
      switch (filter) {
      case constants.ALL:
        calledWithAll = true;
      case constants.OPEN:
        calledWithOpen = true;
      case constants.READY_FOR_BILL:
        calledWithReady = true;
      }
    };
    const component = renderIntoDocument(OrdersFilter({ filterOrders }));
    const filters = scryRenderedDOMComponentsWithClass(component, 'orders-filter-option');
    Simulate.click(filters[0]);
    Simulate.click(filters[1]);
    Simulate.click(filters[2]);

    expect(calledWithAll).to.be.true;
    expect(calledWithOpen).to.be.true;
    expect(calledWithReady).to.be.true;
  });
});
