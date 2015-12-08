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
  const food = { id: '1', name: 'food' };
  const burger = { id: '2', name: 'burger' };
  const masterItems = [food, burger];
  let handleSubmit;
  let handleUpdateEntries;
  let component;

  beforeEach(() => {
  handleSubmit = spy();
    component = renderIntoDocument(MasterItems({ masterItems, handleUpdateEntries, entries: [], handleSubmit }));
  });

  it('should clear comment after adding an entry', () => {
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');
    let addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');

    Simulate.change(addCommentFld, { target: { value: 'no meat' } });
    addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');

    expect(addCommentFld.value).to.equal('no meat');
    Simulate.click(addEntry);

    addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');
    expect(addCommentFld.value).to.equal('');
  });

  it('adds the selected item and comment', () => {
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');
    const selectItem = findRenderedDOMComponentWithClass(component, 'select-item');
    const addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');

    Simulate.change(selectItem, { target: { value: burger.id } });
    Simulate.change(addCommentFld, { target: { value: 'no meat' } });
    Simulate.click(addEntry);

    const entryName = findRenderedDOMComponentWithClass(component, 'entry-name');
    const entryComment = findRenderedDOMComponentWithClass(component, 'entry-comment');
    expect(entryName.textContent).to.equal(burger.name);
    expect(entryComment.textContent).to.equal('no meat');
  });

  it('defaults to the first item in master items', () => {
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');

    Simulate.click(addEntry);

    const entryName = findRenderedDOMComponentWithClass(component, 'entry-name');
    expect(entryName.textContent).to.equal(food.name);
  });

  it('calls the handle submit prop with entries', () => {
    const submitOrder = findRenderedDOMComponentWithClass(component, 'submit-order');
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');
    const selectItem = findRenderedDOMComponentWithClass(component, 'select-item');

    Simulate.change(selectItem, { target: { value: burger.id } });
    Simulate.click(addEntry);
    Simulate.click(addEntry);
    Simulate.click(submitOrder);

    expect(handleSubmit.__spy.calls[0][0].length).to.equal(2);
    expect(handleSubmit.__spy.calls[0][0][0].name).to.equal(burger.name);
    expect(handleSubmit).to.have.been.called();
  });

  it('clears the entries list after submit', () => {
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');
    const submitOrder = findRenderedDOMComponentWithClass(component, 'submit-order');

    Simulate.click(addEntry);
    Simulate.click(submitOrder);

    const entries = scryRenderedDOMComponentsWithClass(component, 'entries');

    expect(entries.length).to.equal(0);
  });

  it('shows message when no entries', () => {
    let noEntriesMsg = scryRenderedDOMComponentsWithClass(component, 'no-entries');
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');

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
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');

    Simulate.click(addEntry);

    expect(submitButton.disabled).to.be.false;
  });
});
