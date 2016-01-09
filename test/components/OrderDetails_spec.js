import { expect, spy } from 'chai';
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

function setup({ orders, masterItems, location = {} } = {}) {
  const changeEntryStatus = () => {};
  const loadItems = () => {};
  const addEntriesToOrder = () => {};
  const setReadyForBill = () => {};
  const setClosed = () => {};
  const updateTableNumber = () => {};
  const setOpen = spy();
  const id = 1;
  const params = { id };
  const props = {
    orders: orders || [Generator.order().id(id).status(constants.OPEN).tableNumber('14').build()],
    params,
    changeEntryStatus,
    loadItems,
    addEntriesToOrder,
    setReadyForBill,
    setOpen,
    setClosed,
    masterItems,
    updateTableNumber,
    location
  };
  const component = renderIntoDocument(OrderDetails(props));
  const orderInfo = findRenderedDOMComponentWithClass(component, 'order-information');

  return {
    component,
    orderInfo,
    id,
    setOpen
  };
}

describe('OrderDetails', () => {
  it('renders title order information', () => {
    const { orderInfo, id } = setup();

    expect(orderInfo.textContent).to.contain(id.toString());
    expect(orderInfo.textContent).to.contain('OPEN');
    expect(orderInfo.textContent).to.contain('14');
  });

  it('renders three filter options', () => {
    const { component } = setup();
    const filters = scryRenderedDOMComponentsWithClass(component, 'filter-option');

    expect(filters.length).to.equal(3);
  });

  describe('renders the active order entries', () => {
    const entries = [
      { name: 'rice', price: 1050, comment: 'brown rice', status: 'OPEN', type: 'FOOD' },
      { name: 'pho', price: 850, comment: 'extra meat', status: 'CANCELED', type: 'FOOD' },
      { name: 'beer', price: 150, comment: 'cold', status: 'DELIVERED', type: 'DRINK' },
      { name: 'steak', price: 150, comment: 'medium rare', status: 'COMPLETED', type: 'FOOD' }
    ];
    const orders = [Generator.order().id(1).entries(entries).status(constants.OPEN).build()];

    it('defaults to All non-canceled entries', () => {
      const { component } = setup({ orders });
      const entryNames = scryRenderedDOMComponentsWithClass(component, 'entry-name');
      const entryComments = scryRenderedDOMComponentsWithClass(component, 'entry-comment');
      const entryStatuses = scryRenderedDOMComponentsWithClass(component, 'entry-status');
      const filters = scryRenderedDOMComponentsWithClass(component, 'filter-option');
      const orderEntries = scryRenderedDOMComponentsWithClass(component, 'order-entry');

      expect(orderEntries.length).to.equal(3);
    });

    it('renders by filter', () => {
      const { component } = setup({ orders });
      const filters = scryRenderedDOMComponentsWithClass(component, 'filter-option');
      Simulate.click(filters[1]);
      const orderEntries = scryRenderedDOMComponentsWithClass(component, 'order-entry');
      const entryNames = scryRenderedDOMComponentsWithClass(component, 'entry-name');
      const entryComments = scryRenderedDOMComponentsWithClass(component, 'entry-comment');
      const entryStatuses = scryRenderedDOMComponentsWithClass(component, 'entry-status');

      expect(orderEntries.length).to.equal(2);
      expect(entryNames[0].textContent).to.contain('rice');
      expect(entryComments[0].textContent).to.contain('brown rice');
      expect(entryStatuses[0].textContent).to.contain('OPEN');
    });
  });

  it('toggles add entry form', () => {
    const entries = [
      { name: 'rice', price: 1050, comment: 'brown rice', status: 'OPEN' }
    ];
    const orders = [Generator.order().id(1).entries(entries).status(constants.OPEN).build()];
    const masterItems = [Generator.item().build()];
    const { component } = setup({ orders, masterItems });
    const toggleForm = findRenderedDOMComponentWithClass(component, 'toggle-add-entry');
    let items = scryRenderedDOMComponentsWithClass(component, 'item');

    expect(items.length).to.equal(0);

    Simulate.click(toggleForm);
    items = scryRenderedDOMComponentsWithClass(component, 'item');

    expect(items.length).to.equal(1);
  });

  it('shows entry form when passed in as query param', () => {
    const entries = [
      { name: 'rice', price: 1050, comment: 'brown rice', status: 'OPEN' }
    ];
    const orders = [Generator.order().id(1).entries(entries).status(constants.OPEN).build()];
    const masterItems = [Generator.item().build()];
    const location = { query: { showAddEntry: 'true' } };
    const { component } = setup({ orders, masterItems, location });
    const items = scryRenderedDOMComponentsWithClass(component, 'item');

    expect(items.length).to.equal(1);
  });
});
