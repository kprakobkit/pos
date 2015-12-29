import { expect, spy } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import MasterItemsComponent from '../../src/components/MasterItems';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const MasterItems = React.createFactory(MasterItemsComponent);

describe('Master Items', () => {
  const food = { id: '1', name: 'food', category: 'food' };
  const burger = { id: '2', name: 'burger', category: 'food' };
  const masterItems = [food, burger];
  let handleSubmit;
  let handleUpdateEntries;
  let component;

  beforeEach(() => {
  handleSubmit = spy();
    component = renderIntoDocument(MasterItems({ masterItems, handleUpdateEntries, entries: [], handleSubmit }));
  });

  it('defaults to the first item in master items', () => {
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry-burger');

    Simulate.click(addEntry);

    const entryName = findRenderedDOMComponentWithClass(component, 'entry-name');
    expect(entryName.textContent).to.equal(burger.name);
  });

  it('calls the handle submit prop with entries', () => {
    const submitOrder = findRenderedDOMComponentWithClass(component, 'submit-order');
    const selectBurger = findRenderedDOMComponentWithClass(component, 'item-burger');

    Simulate.click(selectBurger);
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry-burger');
    Simulate.click(addEntry);
    const addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment-burger');
    Simulate.change(addCommentFld, { target: { value: 'no meat' } });
    Simulate.click(addEntry);
    Simulate.click(submitOrder);

    expect(handleSubmit.__spy.calls[0][0].length).to.equal(2);
    expect(handleSubmit.__spy.calls[0][0][0].name).to.equal(burger.name);
    expect(handleSubmit.__spy.calls[0][0][0].comment).to.equal('no meat');
    expect(handleSubmit.__spy.calls[0][0][1].comment).to.equal('');
  });

  it('clears the entries list after submit', () => {
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry-burger');
    const submitOrder = findRenderedDOMComponentWithClass(component, 'submit-order');

    Simulate.click(addEntry);
    Simulate.click(submitOrder);

    const entries = scryRenderedDOMComponentsWithClass(component, 'entries');

    expect(entries.length).to.equal(0);
  });

  it('shows message when no entries', () => {
    let noEntriesMsg = scryRenderedDOMComponentsWithClass(component, 'no-entries');
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry-burger');

    expect(noEntriesMsg.length).to.be.above(0);
    Simulate.click(addEntry);

    noEntriesMsg = scryRenderedDOMComponentsWithClass(component, 'no-entries');
    expect(noEntriesMsg.length).to.equal(0);
  });

  it('disables submit button when no entries', () => {
    const submitButton = findRenderedDOMComponentWithClass(component, 'submit-order');

    expect(submitButton.disabled).to.be.true;
  });

  it('enables submit button there is at least one entry', () => {
    const submitButton = findRenderedDOMComponentWithClass(component, 'submit-order');
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry-burger');

    Simulate.click(addEntry);

    expect(submitButton.disabled).to.be.false;
  });
});
