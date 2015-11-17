import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import OrderDetailsComponent from '../../src/components/OrderDetails';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;
const OrderDetails = React.createFactory(OrderDetailsComponent);

describe('OrderDetails', () => {
  const changeEntryStatus = () => {};
  const loadItems = () => {};
  const addEntriesToOrder = () => {};

  it('renders title with correct order number from params', () => {
    const id = 1;
    const params = { id };
    const props = { orders: [{ status: 'open', id: 1, entries: [] }], params, changeEntryStatus, loadItems };
    const component = renderIntoDocument(OrderDetails(props));
    const title = findRenderedDOMComponentWithClass(component, 'order-title');

    expect(title.textContent).to.contain(id.toString());
  });

  it('renders the order status', () => {
    const props = { orders: [{ status: 'open', id: 1, entries: [] }], params: { id: 1 }, changeEntryStatus, loadItems };
    const component = renderIntoDocument(OrderDetails(props));
    const status = findRenderedDOMComponentWithClass(component, 'order-status');

    expect(status.textContent).to.contain('open');
  });

  it('renders the active order entries', () => {
    const entries = [
      { name: 'rice', price: 1050, comment: 'brown rice', status: 'OPEN' },
      { name: 'pho', price: 850, comment: 'extra meat', status: 'CANCELED' },
      { name: 'egg', price: 150, comment: 'sunny side up', status: 'DELIVERED' }
    ];
    const props = { orders: [{ status: 'open', id: 1, entries }], params: { id: 1 }, changeEntryStatus, loadItems };
    const component = renderIntoDocument(OrderDetails(props));
    const orderEntries = scryRenderedDOMComponentsWithClass(component, 'order-entry');
    const entryNames = scryRenderedDOMComponentsWithClass(component, 'entry-name');
    const entryComments = scryRenderedDOMComponentsWithClass(component, 'entry-comment');
    const entryStatuses = scryRenderedDOMComponentsWithClass(component, 'entry-status');

    expect(orderEntries.length).to.equal(2);
    expect(entryNames[0].textContent).to.contain('rice');
    expect(entryNames[1].textContent).to.contain('egg');
    expect(entryComments[0].textContent).to.contain('brown rice');
    expect(entryComments[1].textContent).to.contain('sunny side up');
    expect(entryStatuses[0].textContent).to.contain('OPEN');
    expect(entryStatuses[1].textContent).to.contain('DELIVERED');
  });

  it('toggles add entry', () => {
    const props = { orders: [{ status: 'open', id: 1, entries: [] }], params: { id: 1 }, changeEntryStatus, loadItems, addEntriesToOrder };
    const component = renderIntoDocument(OrderDetails(props));
    const toggleForm = findRenderedDOMComponentWithClass(component, 'toggle-add-entry');
    let masterItems = scryRenderedDOMComponentsWithClass(component, 'master-items');

    expect(masterItems.length).to.equal(0);

    Simulate.click(toggleForm);

    masterItems = findRenderedDOMComponentWithClass(component, 'master-items');

    expect(masterItems).to.exist;
  });
});

