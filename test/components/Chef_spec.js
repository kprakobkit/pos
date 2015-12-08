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

function setup() {
  const Chef = React.createFactory(ChefComponent);
  const loadOrders = () => {};
  const food = Generator.entry().type(constants.FOOD).status(constants.OPEN).build();
  const drink = Generator.entry().type(constants.DRINK).status(constants.OPEN).build();
  const entries = [food, drink];
  const orders = [Generator.order().id('order1').entries(entries).tableNumber('14').build()];
  const component = renderIntoDocument(Chef({ orders, loadOrders, changeEntryStatus }));

  return {
    openEntries: scryRenderedDOMComponentsWithClass(component, 'open-entry'),
    entries
  };
}

describe('Chef', () => {
  it('should render open entries of type FOOD', () => {
    const { openEntries, entries } = setup();

    expect(openEntries.length).to.equal(1);
  });
});
