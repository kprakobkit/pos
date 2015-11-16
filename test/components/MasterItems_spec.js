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
  const title = 'title';
  let handleUpdateEntries;
  let component;

  beforeEach(() => {
    handleUpdateEntries = spy();
    component = renderIntoDocument(MasterItems({ masterItems, handleUpdateEntries, entries: [], title }));
  });

  it('should the title', () => {
    const titleFld = findRenderedDOMComponentWithClass(component, 'title');

    expect(titleFld.textContent).to.equal(title);
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
    const selectItems = findRenderedDOMComponentWithClass(component, 'select-items');
    const addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');

    Simulate.change(selectItems, { target: { value: burger.id } });
    Simulate.change(addCommentFld, { target: { value: 'no meat' } });
    Simulate.click(addEntry);

    const entries = handleUpdateEntries.__spy.calls[0][0];
    expect(entries[0].name).to.equal(burger.name);
    expect(entries[0].id).to.equal(burger.id);
    expect(entries[0].comment).to.equal('no meat');
  });

  it('defaults to the first item in master items', () => {
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');

    Simulate.click(addEntry);

    const entries = handleUpdateEntries.__spy.calls[0][0];
    expect(entries[0].name).to.equal(food.name);
  });
});
