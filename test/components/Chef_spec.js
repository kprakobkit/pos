import { expect, spy } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ChefComponent from '../../src/components/Chef';
import Generator from '../support/generator';
import constants from '../../src/constants';
import _ from 'underscore';
import moment from 'moment';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const changeEntryStatus = spy();

function setup({ orders } = {}) {
  const Chef = React.createFactory(ChefComponent);
  const loadOrders = () => {};
  const entry1 = Generator.entry().status(constants.CLOSED).build();
  const entry2 = Generator.entry().status(constants.OPEN).build();
  const entries = [entry1, entry2];
  const order1 = Generator.order().id('order1').entries(entries).tableNumber('14').build();
  const order2 = Generator.order().id('order2').entries(entries).tableNumber('15').build();
  const defaultOrders = [order1, order2];
  const component = renderIntoDocument(Chef({ orders: orders || defaultOrders, loadOrders, changeEntryStatus }));

  return {
    openEntries: scryRenderedDOMComponentsWithClass(component, 'open-entry'),
    entries,
    component
  };
}

describe('Chef', () => {
  it('should render open entries with the table number for all orders', () => {
    const { openEntries, entries } = setup();

    expect(openEntries.length).to.equal(2);
    expect(openEntries[0].textContent).to.contain('14');
    expect(openEntries[1].textContent).to.contain('15');
  });

  it('displays entries in order that it was created', () => {
    const entry1 = Generator.entry().name('after').createdAt(moment(constants.NOW).add(1, 'days')).status(constants.OPEN).build();
    const entry2 = Generator.entry().name('before').createdAt(moment(constants.NOW)).status(constants.OPEN).build();
    const order1 = Generator.order().entries([entry1]).build();
    const order2 = Generator.order().entries([entry2]).build();
    const { openEntries } = setup({ orders: [order1, order2] });

    expect(openEntries[0].textContent).to.contain(entry2.name);
    expect(openEntries[1].textContent).to.contain(entry1.name);
  });

  it('should display the first six entries', () => {
    const size = _.range(3);
    const orders = _.map(size, () => {
      const entries = _.map(size, () => Generator.entry().status(constants.OPEN).build());
      return Generator.order().entries(entries).build();
    });
    const { openEntries } = setup({ orders });

    expect(openEntries.length).to.equal(6);
  });

  describe('on clicking an entry', () => {
    const entry = Generator.entry().status(constants.OPEN).build();
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
