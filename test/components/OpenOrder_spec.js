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

describe('OpenOrder', () => {
  const changeEntryStatus = () => {};
  const loadItems = () => {};
  const addEntriesToOrder = () => {};
  const setReadyForBill = () => {};

  it('toggles add entry', () => {
    const props = {
      order: { status: 'open', id: 1, entries: [] },
      masterItems: [{ id: '1', name: 'burger' }],
      addEntriesToOrder,
      changeEntryStatus,
      setReadyForBill
    };
    const component = renderIntoDocument(OpenOrder(props));
    const toggleForm = findRenderedDOMComponentWithClass(component, 'toggle-add-entry');
    let masterItems = scryRenderedDOMComponentsWithClass(component, 'master-items');

    expect(masterItems.length).to.equal(0);

    Simulate.click(toggleForm);
    masterItems = findRenderedDOMComponentWithClass(component, 'master-items');

    expect(masterItems).to.exist;
  });
});

