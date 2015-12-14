import { expect, spy } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import BartenderComponent from '../../src/components/Bartender';
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
  const Bartender = React.createFactory(BartenderComponent);
  const loadOrders = () => {};
  const food = Generator.entry().type(constants.FOOD).status(constants.OPEN).build();
  const drinkO = Generator.entry().type(constants.DRINK).status(constants.OPEN).build();
  const drinkC = Generator.entry().type(constants.DRINK).status(constants.CANCELED).build();
  const entries = [food, drinkO, drinkC];
  const orders = [Generator.order().id('order1').entries(entries).tableNumber('14').build()];
  const component = renderIntoDocument(Bartender({ orders, loadOrders, changeEntryStatus }));

  return {
    entries: scryRenderedDOMComponentsWithClass(component, 'entry')
  };
}

describe('Bartender', () => {
  it('should render open and closed entries of type DRINK', () => {
    const { entries } = setup();

    expect(entries.length).to.equal(2);
  });
});
