import { expect } from 'chai';
import { Component, DOM as dom, createFactory } from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import tableComponentFactory from './table_component_factory';
import EntryComponent from '../../src/components/Entry';
import _ from 'underscore';
import Generator from '../support/generator';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;
const Entry = createFactory(EntryComponent);
const Table = createFactory(tableComponentFactory(Entry));

function setup({ ofOpenOrder } = {}) {
  const status = constants.OPEN;
  const entry = Generator.entry().status(status).build();
  const component = renderIntoDocument(Table(_.extend({}, entry, { ofOpenOrder })));

  return {
    component,
    entry
  };
}

describe('Entry', () => {

  it('renders name and comment', () => {
    const { component, entry } = setup();
    const entryName = findRenderedDOMComponentWithClass(component, 'entry-name');
    const entryComment = findRenderedDOMComponentWithClass(component, 'entry-comment');

    expect(entryName.textContent).to.equal(entry.name);
    expect(entryComment.textContent).to.equal(entry.comment);
  });

  it('renders status and not price if under open order', () => {
    const { component } = setup();
    const entryStatus = findRenderedDOMComponentWithClass(component, 'entry-status');
    const entryPrice = scryRenderedDOMComponentsWithClass(component, 'entry-price');

    expect(entryStatus).to.exist;
    expect(entryPrice.length).to.equal(0);
  });

  it('renders price and not status if under processing order', () => {
    const ofOpenOrder = false;
    const { component, entry } = setup({ ofOpenOrder });
    const entryPrice = findRenderedDOMComponentWithClass(component, 'entry-price');
    const entryStatus = scryRenderedDOMComponentsWithClass(component, 'entry-status');

    expect(entryPrice.textContent).to.equal(`$${(entry.price / 100).toFixed(2)}`);
    expect(entryStatus.length).to.equal(0);
  });

  describe('Open', () => {
    const { component } = setup();
    it('shows mark delivered delivered', () => {
    });
  });
});
