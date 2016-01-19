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
  const filter = constants.ALL;
  const printFilterName = (status) => {};
  const filters = [constants.OPEN, constants.READY_FOR_BILL, constants.ALL];

  it('renders filter options from props', () => {
    const applyFilter = () => {};
    const component = renderIntoDocument(Filter({ filter, applyFilter, printFilterName, filters }));
    const filterOptions = scryRenderedDOMComponentsWithClass(component, 'filter-option');

    expect(filterOptions.length).to.equal(3);
    expect(filterOptions[0].className).to.contain('filter-open');
    expect(filterOptions[1].className).to.contain('filter-ready');
    expect(filterOptions[2].className).to.contain('filter-all');
  });

  it('calls handler to filter orders', () => {
    let calledWithAll = false;
    let calledWithOpen = false;
    let calledWithReady = false;
    const applyFilter = (filter) => {
      switch (filter) {
      case constants.ALL:
        calledWithAll = true;
      case constants.OPEN:
        calledWithOpen = true;
      case constants.READY_FOR_BILL:
        calledWithReady = true;
      }
    };
    const component = renderIntoDocument(Filter({ filter, applyFilter, printFilterName, filters }));
    const filterOptions = scryRenderedDOMComponentsWithClass(component, 'filter-option');
    Simulate.click(filterOptions[0]);
    Simulate.click(filterOptions[1]);
    Simulate.click(filterOptions[2]);

    expect(calledWithAll).to.be.true;
    expect(calledWithOpen).to.be.true;
    expect(calledWithReady).to.be.true;
  });
});
