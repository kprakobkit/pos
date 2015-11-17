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

  it('removes an item from an order', () => {
    const addEntry = findRenderedDOMComponentWithClass(component, 'add-entry');
    const selectItems = findRenderedDOMComponentWithClass(component, 'select-items');
    const submitOrder = findRenderedDOMComponentWithClass(component, 'submit-order');

    Simulate.change(selectItems, { target: { value: burger.id } });
    Simulate.click(addEntry);
    const removeEntry = findRenderedDOMComponentWithClass(component, 'remove-entry');
    Simulate.click(removeEntry);

    const entries = scryRenderedDOMComponentsWithClass(component, 'entries');
    expect(entries.length).to.equal(0);
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
