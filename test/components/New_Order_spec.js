import { expect } from 'chai';
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
    const items = [item1, item2];
    const component = renderIntoDocument(NewOrder({ items, loadItems }));
    const options = scryRenderedDOMComponentsWithClass(component, 'option');

    expect(options.length).to.equal(items.length);
  });

  it('adds an item to the list each time', () => {
    const item = { id: '1', name: 'food' };
    const component = renderIntoDocument(NewOrder({ items: [item], loadItems }));
    const addItemBtn = findRenderedDOMComponentWithClass(component, 'add-item');

    Simulate.click(addItemBtn);
    Simulate.click(addItemBtn);

    const addedItems = scryRenderedDOMComponentsWithClass(component, 'addedItem');
    expect(addedItems.length).to.equal(2);
    expect(addedItems[0].textContent).to.equal('food');
  });

  it('calls adds order on submit', () => {
    const addOrder = chai.spy();
    const item = { id: '1', name: 'food' };
    const items = [item];
    const component = renderIntoDocument(NewOrder({ items: items, loadItems, addOrder }));
    const addItemBtn = findRenderedDOMComponentWithClass(component, 'add-item');
    const submitOrderBtn = findRenderedDOMComponentWithClass(component, 'submit-order');

    Simulate.click(addItemBtn);
    Simulate.click(submitOrderBtn);

    expect(addOrder.__spy.calls[0][0]).to.deep.equal(items);
  });
});
