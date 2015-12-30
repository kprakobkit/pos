import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import FilterComponent from '../../src/components/Filter';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const Filter = React.createFactory(FilterComponent);

describe('Filter', () => {
  const printOrderStatus = (status) => {};

  it('renders three filter options', () => {
    const filterOrders = () => {};
    const component = renderIntoDocument(Filter({ filterOrders, printOrderStatus }));
    const filters = scryRenderedDOMComponentsWithClass(component, 'orders-filter-option');

    expect(filters.length).to.equal(3);
    expect(filters[0].className).to.contain('orders-filter-open');
    expect(filters[1].className).to.contain('orders-filter-ready');
    expect(filters[2].className).to.contain('orders-filter-all');
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
    const component = renderIntoDocument(Filter({ filterOrders, printOrderStatus }));
    const filters = scryRenderedDOMComponentsWithClass(component, 'orders-filter-option');
    Simulate.click(filters[0]);
    Simulate.click(filters[1]);
    Simulate.click(filters[2]);

    expect(calledWithAll).to.be.true;
    expect(calledWithOpen).to.be.true;
    expect(calledWithReady).to.be.true;
  });
});
