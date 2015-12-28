import { expect } from 'chai';
import { Component, DOM as dom, createFactory } from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import tableComponentFactory from './table_component_factory';
import OrderComponent from '../../src/components/Order';
import Generator from '../support/generator';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;
const Order = createFactory(OrderComponent);
const Table = createFactory(tableComponentFactory(Order));

function setup({ tableNumber = '10', status = 'open', entries = [] }) {
  const printOrderStatus = (status) => status;
  const props = { status, printOrderStatus, tableNumber, entries };
  const component = renderIntoDocument(Table(props));

  return {
    component
  };
}

describe('Order', () => {
  it('renders table number', () => {
    const { component } = setup({ tableNumber: '14' });
    const tableNumber = findRenderedDOMComponentWithClass(component, 'table-number');

    expect(tableNumber.textContent).to.contain('14');
  });

  it('renders status', () => {
    const status = constants.OPEN.toLowerCase();
    const { component } = setup({ status });
    const orderStatus = findRenderedDOMComponentWithClass(component, 'order-status');

    expect(orderStatus.textContent).to.contain(status);
  });

  it('renders number of completed entries', () => {
    const completedEntry = Generator.entry().status(constants.COMPLETED).build();
    const openEntry = Generator.entry().status(constants.OPEN).build();
    const { component } = setup({ entries: [openEntry, completedEntry] });
    const completedEntries = findRenderedDOMComponentWithClass(component, 'completed-entries');

    expect(completedEntries.textContent).to.equal('1');
  });
});
