import { expect } from 'chai';
import { Component, DOM as dom, createFactory } from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import tableComponentFactory from './table_component_factory';
import EntryComponent from '../../src/components/Entry';
import _ from 'underscore';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;
const Entry = createFactory(EntryComponent);
const Table = createFactory(tableComponentFactory(Entry));

describe('Entry', () => {
  const name = 'Pho';
  const status = constants.OPEN;
  const comment = 'extra soup';
  const price = 1025;
  const props = { name, status, comment, price };

  it('renders name and comment', () => {
    const component = renderIntoDocument(Table(props));
    const entryName = findRenderedDOMComponentWithClass(component, 'entry-name');
    const entryComment = findRenderedDOMComponentWithClass(component, 'entry-comment');

    expect(entryName.textContent).to.equal(name);
    expect(entryComment.textContent).to.equal(comment);
  });

  it('renders status and not price if under open order', () => {
    const component = renderIntoDocument(Table(props));
    const entryStatus = findRenderedDOMComponentWithClass(component, 'entry-status');
    const entryPrice = scryRenderedDOMComponentsWithClass(component, 'entry-price');

    expect(entryStatus).to.exist;
    expect(entryPrice.length).to.equal(0);
  });

  it('renders price and not status if under processing order', () => {
    const ofOpenOrder = false;
    const component = renderIntoDocument(Table(_.extend({}, props, { ofOpenOrder })));
    const entryPrice = findRenderedDOMComponentWithClass(component, 'entry-price');
    const entryStatus = scryRenderedDOMComponentsWithClass(component, 'entry-status');

    expect(entryPrice).to.exist;
    expect(entryPrice.textContent).to.equal(`$${price / 100}`);
    expect(entryStatus.length).to.equal(0);
  });
});
