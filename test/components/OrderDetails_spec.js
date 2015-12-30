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

function setup({ orders, masterItems } = {}) {
  const changeEntryStatus = () => {};
  const loadItems = () => {};
  const addEntriesToOrder = () => {};
  const setReadyForBill = () => {};
  const setClosed = () => {};
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
    masterItems
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

  it('renders title three filter options', () => {
    const { component } = setup();
    const filters = scryRenderedDOMComponentsWithClass(component, 'filter-option');

    expect(filters.length).to.equal(3);
  });

  describe('renders the active order entries', () => {
    const entries = [
      { name: 'rice', price: 1050, comment: 'brown rice', status: 'OPEN' },
      { name: 'pho', price: 850, comment: 'extra meat', status: 'CANCELED' },
      { name: 'egg', price: 150, comment: 'sunny side up', status: 'DELIVERED' },
      { name: 'soup', price: 150, comment: 'extra hot', status: 'CLOSED' }
    ];
    const orders = [Generator.order().id(1).entries(entries).status(constants.OPEN).build()];

    it('defaults to open entries', () => {
      const { component } = setup({ orders });
      const entryNames = scryRenderedDOMComponentsWithClass(component, 'entry-name');
      const entryComments = scryRenderedDOMComponentsWithClass(component, 'entry-comment');
      const entryStatuses = scryRenderedDOMComponentsWithClass(component, 'entry-status');
      const filters = scryRenderedDOMComponentsWithClass(component, 'filter-option');
      const orderEntries = scryRenderedDOMComponentsWithClass(component, 'order-entry');

      expect(orderEntries.length).to.equal(1);
      expect(entryNames[0].textContent).to.contain('rice');
      expect(entryComments[0].textContent).to.contain('brown rice');
      expect(entryStatuses[0].textContent).to.contain('OPEN');
    });

    it('renders by filter', () => {
      const { component } = setup({ orders });
      const filters = scryRenderedDOMComponentsWithClass(component, 'filter-option');
      Simulate.click(filters[2]);
      const orderEntries = scryRenderedDOMComponentsWithClass(component, 'order-entry');
      const entryNames = scryRenderedDOMComponentsWithClass(component, 'entry-name');
      const entryComments = scryRenderedDOMComponentsWithClass(component, 'entry-comment');
      const entryStatuses = scryRenderedDOMComponentsWithClass(component, 'entry-status');

      expect(orderEntries.length).to.equal(1);
      expect(entryNames[0].textContent).to.contain('egg');
      expect(entryComments[0].textContent).to.contain('sunny side up');
      expect(entryStatuses[0].textContent).to.contain('DELIVERED');
    });
  });

  describe('Orders - Ready for Bill', () => {
    it('renders back to open status button', () => {
      const orders = [Generator.order().id(1).status(constants.READY_FOR_BILL).build()];
      const { component } = setup({ orders });

      const backToOpen = findRenderedDOMComponentWithClass(component, 'back-to-open');
    });

    it('calls setOpen wit orderId', () => {
      const orders = [Generator.order().id(1).status(constants.READY_FOR_BILL).build()];
      const { component, setOpen } = setup({ orders });
      const backToOpen = findRenderedDOMComponentWithClass(component, 'back-to-open');
      Simulate.click(backToOpen);

      expect(setOpen).to.have.been.called.with(1);;
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
    let masterItemsList = scryRenderedDOMComponentsWithClass(component, 'master-items');

    expect(masterItemsList.length).to.equal(0);

    Simulate.click(toggleForm);
    masterItemsList = findRenderedDOMComponentWithClass(component, 'master-items');

    expect(masterItems.length).to.equal(1);
  });
});
