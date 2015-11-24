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

const Chef = React.createFactory(ChefComponent);
const loadOrders = () => {};

describe('Chef', () => {
  it('should render open entries for all orders', () => {
    const burger = Generator.entry().name('burger').status(constants.OPEN).build();
    const pho = Generator.entry().name('pho').status(constants.CLOSED).build();
    const entries = [burger, pho];
    const order1 = Generator.order().entries(entries).build();
    const order2 = Generator.order().entries(entries).build();
    const orders = [order1, order2];
    const component = renderIntoDocument(Chef({ orders, loadOrders }));

    const openEntry = scryRenderedDOMComponentsWithClass(component, 'open-entry');
    expect(openEntry.length).to.equal(2);
  });

  it('should display the first six entries', () => {
    const size = _.range(3);
    const orders = _.map(size, () => {
      const entries = _.map(size, () => Generator.entry().status(constants.OPEN).build());
      return Generator.order().entries(entries).build();
    });

    const component = renderIntoDocument(Chef({ orders, loadOrders }));

    const openEntry = scryRenderedDOMComponentsWithClass(component, 'open-entry');
    expect(openEntry.length).to.equal(6);
  });
});
