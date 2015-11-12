import { expect, spy } from 'chai';
import React from 'react';
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
  const food = { id: '1', name: 'food' };
  const burger = { id: '2', name: 'burger' };
  const masterItems = [food, burger];
  const loadItems = () => {};
  const addOrder = spy();
  let component;

  beforeEach(() => {
    component = renderIntoDocument(NewOrder({ masterItems, loadItems, addOrder }));
  });

  it('renders an option for each item in props', () => {
    const options = scryRenderedDOMComponentsWithClass(component, 'option');

    expect(options.length).to.equal(masterItems.length);
  });

  it('adds an entry to the list each time', () => {
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');
    const addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');

    Simulate.click(addEntry);

    const entries = scryRenderedDOMComponentsWithClass(component, 'entries');
    const entryName = scryRenderedDOMComponentsWithClass(component, 'entry-name');
    expect(entries.length).to.equal(1);
    expect(entryName[0].textContent).to.equal(food.name);
  });

  it('adds a new comment for each entry', () => {
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');
    const addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');

    Simulate.change(addCommentFld, { target: { value: 'comment' } });
    Simulate.click(addEntry);
    Simulate.change(addCommentFld, { target: { value: 'new comment' } });
    Simulate.click(addEntry);

    const entryComment = scryRenderedDOMComponentsWithClass(component, 'entry-comment');

    expect(entryComment[0].textContent).to.equal('comment');
    expect(entryComment[1].textContent).to.equal('new comment');
  });

  it('clears the comment after adding an entry', () => {
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');
    let addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');

    Simulate.change(addCommentFld, { target: { value: 'no meat' } });
    addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');

    expect(addCommentFld.value).to.equal('no meat');
    Simulate.click(addEntry);

    addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment');
    expect(addCommentFld.value).to.equal('');
  });

  it('defaults to the first item in the list if not selected', () => {
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');
    const selectItems = findRenderedDOMComponentWithClass(component, 'select-items');
    const submitOrder = findRenderedDOMComponentWithClass(component, 'submit-order');

    Simulate.click(addEntry);
    Simulate.click(submitOrder);

    const entries = scryRenderedDOMComponentsWithClass(component, 'entries');
    const entryName = scryRenderedDOMComponentsWithClass(component, 'entry-name');
    expect(entries.length).to.equal(1);
    expect(entryName[0].textContent).to.equal(food.name);
  });

  it('removes an item from an order', () => {
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');
    const selectItems = findRenderedDOMComponentWithClass(component, 'select-items');
    const submitOrder = findRenderedDOMComponentWithClass(component, 'submit-order');

    Simulate.change(selectItems, { target: { value: burger.id } });
    Simulate.click(addEntry);
    const removeEntry = scryRenderedDOMComponentsWithClass(component, 'remove-entry');
    Simulate.click(removeEntry[0]);
    Simulate.change(selectItems, { target: { value: food.id } });
    Simulate.click(addEntry);
    Simulate.click(submitOrder);

    const entries = scryRenderedDOMComponentsWithClass(component, 'entries');
    const entryName = scryRenderedDOMComponentsWithClass(component, 'entry-name');
    expect(entries.length).to.equal(1);
    expect(entryName[0].textContent).to.equal(food.name);
  });

  it('adds an order on submit', () => {
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');
    const selectItems = findRenderedDOMComponentWithClass(component, 'select-items');
    const submitOrder = findRenderedDOMComponentWithClass(component, 'submit-order');

    Simulate.change(selectItems, { target: { value: food.id } });
    Simulate.click(addEntry);
    Simulate.click(submitOrder);

    expect(addOrder.__spy.calls[0][0].length).to.equal(1);
    expect(addOrder.__spy.calls[0][0]).to.deep.equal([{ name: food.name, id: food.id, comment: '' }]);
  });
});
