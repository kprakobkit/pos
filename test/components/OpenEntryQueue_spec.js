import { expect, spy } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import OpenEntryQueueComponent from '../../src/components/OpenEntryQueue';
import Generator from '../support/generator';
import constants from '../../src/constants';
import _ from 'ramda';
import moment from 'moment';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const changeEntryStatus = spy();

function setup({ orders, displayMax } = {}) {
  const OpenEntryQueue = React.createFactory(OpenEntryQueueComponent);
  const loadOrders = () => {};
  const entry1 = Generator.entry().type(constants.FOOD).status(constants.CLOSED).build();
  const entry2 = Generator.entry().type(constants.FOOD).status(constants.OPEN).build();
  const entry3 = Generator.entry().type(constants.DRINK).status(constants.OPEN).build();
  const entries = [entry1, entry2, entry3];
  const order1 = Generator.order().id('order1').entries(entries).tableNumber('14').build();
  const order2 = Generator.order().id('order2').entries(entries).tableNumber('15').build();
  const defaultOrders = [order1, order2];
  const isOpen = _.pathEq(['entry', 'status'], constants.OPEN);
  const isFood = _.pathEq(['entry', 'type'], constants.FOOD);
  const component = renderIntoDocument(OpenEntryQueue({ orders: orders || defaultOrders, loadOrders, changeEntryStatus, displayMax, filterPredicate: _.allPass([isOpen, isFood]) }));

  return {
    openEntries: scryRenderedDOMComponentsWithClass(component, 'open-entry'),
    entries,
    component
  };
}

describe('OpenEntryQueue', () => {
  it('should render entries by the filter predicate with the table number for all orders', () => {
    const { openEntries, entries } = setup();

    expect(openEntries.length).to.equal(2);
  });

  it('should render entries with the table number', () => {
    const { openEntries } = setup();

    expect(openEntries[0].textContent).to.contain('14');
    expect(openEntries[1].textContent).to.contain('15');
  });

  it('displays entries in order that it was created', () => {
    const entry1 = Generator.entry().type(constants.FOOD).name('after').createdAt(moment(constants.NOW).add(1, 'days')).status(constants.OPEN).build();
    const entry2 = Generator.entry().type(constants.FOOD).name('before').createdAt(moment(constants.NOW)).status(constants.OPEN).build();
    const order1 = Generator.order().entries([entry1]).build();
    const order2 = Generator.order().entries([entry2]).build();
    const { openEntries } = setup({ orders: [order1, order2] });

    expect(openEntries[0].textContent).to.contain(entry2.name);
    expect(openEntries[1].textContent).to.contain(entry1.name);
  });


  it('should limit entries displayed by displayMax', () => {
    const entry1 = Generator.entry().status(constants.OPEN).type(constants.FOOD).build();
    const entry2 = Generator.entry().status(constants.OPEN).type(constants.FOOD).build();
    const orders = [Generator.order().entries([entry1, entry2]).build()];
    const { openEntries } = setup({ orders, displayMax: 1 });
    expect(openEntries.length).to.equal(1);
  });

  describe('on clicking an entry', () => {
    const entry = Generator.entry().type(constants.FOOD).status(constants.OPEN).build();
    const order = Generator.order().id('orderId').entries([entry]).build();

    it('should display confirmation when an entry is clicked', () => {
      const { openEntries, component } = setup({ orders: [order] });

      Simulate.click(openEntries[0]);

      const comfirmation = findRenderedDOMComponentWithClass(component, 'confirmation');
    });

    it('should hide confirmation after submit', () => {
      const { openEntries, component } = setup({ orders: [order] });

      Simulate.click(openEntries[0]);
      const submit = findRenderedDOMComponentWithClass(component, 'submit');
      Simulate.click(submit);

      const comfirmation = scryRenderedDOMComponentsWithClass(component, 'confirmation');
      expect(comfirmation.length).to.equal(0);
    });

    it('should hide confirmation on cancel', () => {
      const { openEntries, component } = setup({ orders: [order] });

      Simulate.click(openEntries[0]);
      const cancel = findRenderedDOMComponentWithClass(component, 'cancel');
      Simulate.click(cancel);

      const comfirmation = scryRenderedDOMComponentsWithClass(component, 'confirmation');
      expect(comfirmation.length).to.equal(0);
    });

    it('calls handle click with the entry index, order id, and "COMPLETED" status', () => {
      const { openEntries, component } = setup({ orders: [order] });

      Simulate.click(openEntries[0]);
      const submit = findRenderedDOMComponentWithClass(component, 'submit');
      Simulate.click(submit);

      expect(changeEntryStatus).to.have.been.called();
      expect(changeEntryStatus.__spy.calls[0][0]).to.equal('orderId');
      expect(changeEntryStatus.__spy.calls[0][1]).to.equal(0);
      expect(changeEntryStatus.__spy.calls[0][2]).to.equal(constants.COMPLETED);
    });
  });
});
