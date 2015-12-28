import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import OpenOrderComponent from '../../src/components/OpenOrder';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;
const OpenOrder = React.createFactory(OpenOrderComponent);

function setup({ showAddEntry = false }) {
  const changeEntryStatus = () => {};
  const loadItems = () => {};
  const addEntriesToOrder = () => {};
  const setReadyForBill = () => {};
  const props = {
    order: { status: 'open', id: 1, entries: [] },
    masterItems: [{ id: '1', name: 'burger' }],
    addEntriesToOrder,
    changeEntryStatus,
    setReadyForBill,
    showAddEntry
  };
  const component = renderIntoDocument(OpenOrder(props));

  return {
    component,
    masterItems: scryRenderedDOMComponentsWithClass(component, 'master-items')
  };
}

describe('OpenOrder', () => {
  it('hides form based on props', () => {
    const { masterItems } = setup({ showAddEntry: false });

    expect(masterItems.length).to.equal(0);
  });

  it('shows form based on props', () => {
    const { masterItems } = setup({ showAddEntry: true });

    expect(masterItems.length).to.equal(1);
  });
});

