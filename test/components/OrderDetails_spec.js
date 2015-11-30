import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import OrderDetailsComponent from '../../src/components/OrderDetails';
import Generator from '../support/generator';
import constants from '../../src/constants';

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
  const setReadyForBill = () => {};

  it('renders title with correct order number from params', () => {
    const id = 1;
    const params = { id };
    const props = {
      orders: [{ status: 'OPEN', id: 1, entries: [] }],
      params,
      changeEntryStatus,
      loadItems,
      addEntriesToOrder,
      setReadyForBill
    };
    const component = renderIntoDocument(OrderDetails(props));
    const title = findRenderedDOMComponentWithClass(component, 'order-title');

    expect(title.textContent).to.contain(id.toString());
  });

  it('renders the order status', () => {
    const props = {
      orders: [{ status: 'OPEN', id: 1, entries: [] }],
      params: { id: 1 },
      changeEntryStatus,
      loadItems,
      addEntriesToOrder,
      setReadyForBill
    };
    const component = renderIntoDocument(OrderDetails(props));
    const status = findRenderedDOMComponentWithClass(component, 'order-status');

    expect(status.textContent).to.contain('OPEN');
  });

  it('renders the active order entries', () => {
    const entries = [
      { name: 'rice', price: 1050, comment: 'brown rice', status: 'OPEN' },
      { name: 'pho', price: 850, comment: 'extra meat', status: 'CANCELED' },
      { name: 'egg', price: 150, comment: 'sunny side up', status: 'DELIVERED' }
    ];
    const props = {
      orders: [{ status: 'OPEN', id: 1, entries }],
      params: { id: 1 },
      changeEntryStatus,
      loadItems,
      addEntriesToOrder,
      setReadyForBill
    };
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

  describe('Orders - Ready for Bill', () => {
    it('renders back to open status button', () => {
      const props = {
        orders: [Generator.order().id(1).status(constants.READY_FOR_BILL).build()],
        params: { id: 1 },
        changeEntryStatus,
        loadItems,
        addEntriesToOrder,
        setReadyForBill
      };
      const component = renderIntoDocument(OrderDetails(props));
      const backToOpen = findRenderedDOMComponentWithClass(component, 'back-to-open');
    });
  });
});

