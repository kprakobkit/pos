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

function setup() {
  const food = { id: '1', name: 'food' };
  const burger = { id: '2', name: 'burger' };
  const masterItems = [food, burger];
  const loadItems = () => {};
  const addOrder = spy();
  const component = renderIntoDocument(NewOrder({ masterItems, loadItems, addOrder }));

  return {
    component,
    addEntry: findRenderedDOMComponentWithClass(component, 'add-entry'),
    selectItems: findRenderedDOMComponentWithClass(component, 'select-items'),
    submitOrder: findRenderedDOMComponentWithClass(component, 'submit-order'),
    addOrder,
    burger,
    food
  };
}

describe('New Order', () => {
  it('removes an item from an order', () => {
    const { selectItems, component, addEntry, burger } = setup();
    Simulate.change(selectItems, { target: { value: burger.id } });
    Simulate.click(addEntry);
    const removeEntry = findRenderedDOMComponentWithClass(component, 'remove-entry');
    Simulate.click(removeEntry);
    const entries = scryRenderedDOMComponentsWithClass(component, 'entries');

    expect(entries.length).to.equal(0);
  });

  it('adds an order on submit', () => {
    const { selectItems, component, addEntry, submitOrder, addOrder, food } = setup();
    Simulate.change(selectItems, { target: { value: food.id } });
    Simulate.click(addEntry);
    Simulate.click(submitOrder);

    expect(addOrder.__spy.calls[0][0].length).to.equal(1);
    expect(addOrder.__spy.calls[0][0]).to.deep.equal([{ name: food.name, id: food.id, comment: '' }]);
  });
});
