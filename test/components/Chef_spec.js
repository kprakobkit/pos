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
  const foodO = Generator.entry().type(constants.FOOD).status(constants.OPEN).build();
  const foodC = Generator.entry().type(constants.FOOD).status(constants.CANCELED).build();
  const drink = Generator.entry().type(constants.DRINK).status(constants.OPEN).build();
  const entries = [foodO, foodC, drink];
  const orders = [Generator.order().id('order1').entries(entries).tableNumber('14').build()];
  const component = renderIntoDocument(Chef({ orders, loadOrders, changeEntryStatus }));

  return {
    entries: scryRenderedDOMComponentsWithClass(component, 'entry')
  };
}

describe('Chef', () => {
  it('should render open and closed entries of type FOOD', () => {
    const { entries } = setup();

    expect(entries.length).to.equal(2);
  });
});
