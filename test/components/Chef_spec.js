import { expect, spy } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ChefComponent from '../../src/components/Chef';
import Generator from '../support/generator';
import constants from '../../src/constants';
import _ from 'underscore';

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
  const entry1 = Generator.entry().status(constants.OPEN).build();
  const entry2 = Generator.entry().status(constants.CLOSED).build();
  const entries = [entry1, entry2];
  const order1 = Generator.order().entries(entries).build();
  const order2 = Generator.order().entries(entries).build();
  const defaultOrders = [order1, order2];

  const component = renderIntoDocument(Chef({ orders: orders || defaultOrders, loadOrders, changeEntryStatus }));
  const openEntries = scryRenderedDOMComponentsWithClass(component, 'open-entry');

  return {
    openEntries
  };
}

describe('Chef', () => {
  it('should render open entries for all orders', () => {
    let { openEntries } = setup();

    expect(openEntries.length).to.equal(2);
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

  it('calls handle click with the entry index, order id, and "COMPLETED" status', () => {
    const entry = Generator.entry().status(constants.OPEN).build();
    const order = Generator.order().id('orderId').entries([entry]).build();
    const { openEntries } = setup({ orders: [order] });

    Simulate.click(openEntries[0]);

    expect(changeEntryStatus).to.have.been.called();
    expect(changeEntryStatus.__spy.calls[0][0]).to.equal('orderId');
    expect(changeEntryStatus.__spy.calls[0][1]).to.equal(0);
    expect(changeEntryStatus.__spy.calls[0][2]).to.equal(constants.COMPLETED);
  });
});
