import { expect, spy } from 'chai';
import { Component, DOM as dom, createFactory } from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import tableComponentFactory from './table_component_factory';
import EntryBillComponent from '../../src/components/EntryBill';
import _ from 'underscore';
import $ from '../../src/money';
import Generator from '../support/generator';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;
const EntryBill = createFactory(EntryBillComponent);
const Table = createFactory(tableComponentFactory(EntryBill));

function setup({ name, quantity, price }) {
  const component = renderIntoDocument(Table(_.extend({}, { quantity, price, name })));

  return {
    component
  };
}

describe('Entry Bill', () => {
  it('Render Name, quantity, and total', () => {
    const uniDon = { name: 'uni don', price: 1000, quantity: 2 };
    const expectedTotal = $.format(1000 * 2);
    const { component } = setup(uniDon);
    const entryName = findRenderedDOMComponentWithClass(component, 'entry-name');
    const quantity = findRenderedDOMComponentWithClass(component, 'entry-quantity');
    const entryTotal = findRenderedDOMComponentWithClass(component, 'entry-total');

    expect(entryName.textContent).to.contain(uniDon.name);
    expect(quantity.textContent).to.contain(uniDon.quantity.toString());
    expect(entryTotal.textContent).to.contain(expectedTotal);
  });
});
