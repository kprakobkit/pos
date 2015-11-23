import { expect, spy } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ChefComponent from '../../src/components/Chef';
import Generator from '../support/generator';
import constants from '../../src/constants';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const Chef = React.createFactory(ChefComponent);

describe('Chef', () => {
  it('should render open entries', () => {
    const burger = Generator.entry().name('burger').status(constants.OPEN).build();
    const pho = Generator.entry().name('pho').status(constants.CLOSED).build();
    const entries = [burger, pho];
    const order = Generator.order().entries(entries).build();
    const loadOrders = () => {};
    const component = renderIntoDocument(Chef({ orders: [order], loadOrders }));

    const openEntry = scryRenderedDOMComponentsWithClass(component, 'open-entry');
    expect(openEntry.length).to.equal(1);
  });
});
