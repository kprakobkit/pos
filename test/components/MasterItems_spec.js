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
    const addCommentFld = findRenderedDOMComponentWithClass(component, 'add-comment-burger');
    Simulate.change(addCommentFld, { target: { value: 'no meat' } });
    Simulate.click(submitOrder);

    expect(handleSubmit.__spy.calls[0][0].length).to.equal(1);
    expect(handleSubmit.__spy.calls[0][0][0].name).to.equal(burger.name);
    expect(handleSubmit.__spy.calls[0][0][0].comment).to.equal('no meat');
  });

  describe('Quantity', () => {
    it('calls handle submit prop with the quantity for each entry', () => {
      const submitOrder = findRenderedDOMComponentWithClass(component, 'submit-order');
      const selectBurger = findRenderedDOMComponentWithClass(component, 'item-burger');

      Simulate.click(selectBurger);

      const increaseQuantityButton = findRenderedDOMComponentWithClass(component, 'entry-quantity-increase');

      Simulate.click(increaseQuantityButton);
      Simulate.click(increaseQuantityButton);
      Simulate.click(submitOrder);

      expect(handleSubmit.__spy.calls[0][0].length).to.equal(3);
      expect(handleSubmit.__spy.calls[0][0][0].name).to.equal(burger.name);
    });

    it('defaults quantity to 1', function() {
      const submitOrder = findRenderedDOMComponentWithClass(component, 'submit-order');
      const selectBurger = findRenderedDOMComponentWithClass(component, 'item-burger');

      Simulate.click(selectBurger);

      const entryQuantity = findRenderedDOMComponentWithClass(component, 'entry-quantity-value');

      expect(entryQuantity.textContent).to.equal('1');

      Simulate.click(submitOrder);

      expect(handleSubmit.__spy.calls[0][0].length).to.equal(1);
    });

    it('ensures quantity is at least 1', function() {
      const submitOrder = findRenderedDOMComponentWithClass(component, 'submit-order');
      const selectBurger = findRenderedDOMComponentWithClass(component, 'item-burger');

      Simulate.click(selectBurger);

      const decreaseQuantityButton = findRenderedDOMComponentWithClass(component, 'entry-quantity-decrease');

      Simulate.click(decreaseQuantityButton);
      Simulate.click(decreaseQuantityButton);
      Simulate.click(decreaseQuantityButton);

      const entryQuantity = findRenderedDOMComponentWithClass(component, 'entry-quantity-value');

      expect(entryQuantity.textContent).to.equal('1');

      Simulate.click(submitOrder);

      expect(handleSubmit.__spy.calls[0][0].length).to.equal(1);
    });

    it('defaults quantity to 1 if blank', function() {
      const submitOrder = findRenderedDOMComponentWithClass(component, 'submit-order');
      const selectBurger = findRenderedDOMComponentWithClass(component, 'item-burger');

      Simulate.click(selectBurger);

      const entryQuantity = findRenderedDOMComponentWithClass(component, 'entry-quantity-value');

      Simulate.click(submitOrder);

      expect(handleSubmit.__spy.calls[0][0].length).to.equal(1);
    });
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
