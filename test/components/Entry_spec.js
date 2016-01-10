import { expect, spy } from 'chai';
import { Component, DOM as dom, createFactory } from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import tableComponentFactory from './table_component_factory';
import EntryComponent from '../../src/components/Entry';
import _ from 'underscore';
import $ from '../../src/money';
import Generator from '../support/generator';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;
const Entry = createFactory(EntryComponent);
const Table = createFactory(tableComponentFactory(Entry));

function setup({ entry, ofOpenOrder } = {}) {
  const status = constants.OPEN;
  const anEntry = entry || Generator.entry().status(status).build();
  const changeEntryStatus = spy();
  const component = renderIntoDocument(Table(_.extend({}, anEntry, { ofOpenOrder }, { changeEntryStatus })));

  return {
    component,
    entry: anEntry,
    changeEntryStatus
  };
}

describe('Entry', () => {
  it('renders name and comment', () => {
    const { component, entry } = setup();
    const entryName = findRenderedDOMComponentWithClass(component, 'entry-name');
    const entryComment = findRenderedDOMComponentWithClass(component, 'entry-comment');

    expect(entryName.textContent).to.contain(entry.name);
    expect(entryComment.textContent).to.contain(entry.comment);
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

    expect(entryPrice.textContent).to.equal($.format(entry.price));
    expect(entryStatus.length).to.equal(0);
  });

  describe('Open', () => {
    const { component, entry, changeEntryStatus } = setup();

    it('shows delivered and cancel button', () => {
      findRenderedDOMComponentWithClass(component, 'mark-delivered');
      findRenderedDOMComponentWithClass(component, 'button-action');
    });

    it('canceled - calls changeEntryStatus with CANCELED', () => {
      const canceled = findRenderedDOMComponentWithClass(component, 'button-action');
      Simulate.click(canceled);
      const confirmCancel = findRenderedDOMComponentWithClass(component, 'confirm');
      Simulate.click(confirmCancel);

      expect(changeEntryStatus).to.have.been.called.with(constants.CANCELED);
    });

    it('delivered - calls changeEntryStatus with DELIVERED', () => {
      const delivered = findRenderedDOMComponentWithClass(component, 'mark-delivered');
      Simulate.click(delivered);

      expect(changeEntryStatus).to.have.been.called.with(constants.DELIVERED);
    });
  });

  describe('Delivered', () => {
    const deliveredEntry = Generator.entry().status(constants.DELIVERED).build();
    const { component, entry, changeEntryStatus } = setup({ entry: deliveredEntry });

    it('shows the cancel button', () => {
      findRenderedDOMComponentWithClass(component, 'button-action');
    });
  });

  describe('Completed', () => {
    const completedEntry = Generator.entry().status(constants.COMPLETED).build();
    const { component, entry, changeEntryStatus } = setup({ entry: completedEntry });

    it('shows delivered and cancel button', () => {
      findRenderedDOMComponentWithClass(component, 'mark-delivered');
      findRenderedDOMComponentWithClass(component, 'button-action');
    });
  });
});
