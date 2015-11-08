import { expect, spy } from 'chai';
import React from 'react';
import chai from 'chai';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import NewOrderComponent from '../../src/components/NewOrder';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const NewOrder = React.createFactory(NewOrderComponent);

describe('New Order', () => {
  const loadItems = () => {};

  it('renders an option for each item in props', () => {
    const item1 = { id: '1', name: 'food' };
    const item2 = { id: '2', name: 'burger' };
    const masterItems = [item1, item2];
    const component = renderIntoDocument(NewOrder({ masterItems, loadItems }));
    const options = scryRenderedDOMComponentsWithClass(component, 'option');

    expect(options.length).to.equal(masterItems.length);
  });

  it('adds an item to the list each time', () => {
    const item = { id: '1', name: 'food' };
    const component = renderIntoDocument(NewOrder({ masterItems: [item], loadItems }));
    const addItemBtn = findRenderedDOMComponentWithClass(component, 'add-item');
    const addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');

    Simulate.click(addItemBtn);

    const addedItems = scryRenderedDOMComponentsWithClass(component, 'added-item');
    const entryName = scryRenderedDOMComponentsWithClass(component, 'entry-name');
    expect(addedItems.length).to.equal(1);
    expect(entryName[0].textContent).to.equal('food');
  });

  it('adds a new comment for each entry', () => {
    const item = { id: '1', name: 'food' };
    const component = renderIntoDocument(NewOrder({ masterItems: [item], loadItems }));
    const addItemBtn = findRenderedDOMComponentWithClass(component, 'add-item');
    const addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');

    Simulate.change(addCommentFld, { target: { value: 'comment' } });
    Simulate.click(addItemBtn);
    Simulate.change(addCommentFld, { target: { value: 'new comment' } });
    Simulate.click(addItemBtn);

    const entryComment = scryRenderedDOMComponentsWithClass(component, 'entry-comment');

    expect(entryComment[0].textContent).to.equal('comment');
    expect(entryComment[1].textContent).to.equal('new comment');
  });

  xit('clears the comment after adding an entry', () => {
    const item = { id: '1', name: 'food' };
    const component = renderIntoDocument(NewOrder({ masterItems: [item], loadItems }));
    const addItemBtn = findRenderedDOMComponentWithClass(component, 'add-item');
    let addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');

    Simulate.change(addCommentFld, { target: { value: 'no meat' } });
    addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');
    expect(addCommentFld.value).to.be.equal('no meat');
    Simulate.click(addItemBtn);

    addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');
    expect(addCommentFld.value).to.be.equal('');
  });


  it('adds order an on submit', () => {
    const addOrder = spy();
    const item1 = { id: '1', name: 'food', comment: '' };
    const item2 = { id: '2', name: 'burger', comment: '' };
    const masterItems = [item1, item2];
    const component = renderIntoDocument(NewOrder({ masterItems, loadItems, addOrder }));
    const addItemBtn = findRenderedDOMComponentWithClass(component, 'add-item');
    const selectItems = findRenderedDOMComponentWithClass(component, 'select-items');
    const submitOrderBtn = findRenderedDOMComponentWithClass(component, 'submit-order');

    Simulate.click(addItemBtn);
    Simulate.change(selectItems, { target: { value: item2.id } });
    Simulate.click(addItemBtn);
    Simulate.click(submitOrderBtn);

    expect(addOrder.__spy.calls[0][0]).to.deep.equal(masterItems);
    expect(addOrder.__spy.calls[0][0].length).to.equal(2);
  });
});
