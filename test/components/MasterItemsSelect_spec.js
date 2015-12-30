import { expect, spy } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import MasterItemsSelectComponent from '../../src/components/MasterItemsSelect';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const MasterItemsSelect = React.createFactory(MasterItemsSelectComponent);

function setup() {
  const food = { id: '1', name: 'food', category: 'Appetizer' };
  const burger = { id: '2', name: 'burger', category: 'Main' };
  const hoegarden = { id: '3', name: 'hoegarden', category: 'Beer' };
  const heineken = { id: '4', name: 'heineken', category: 'Beer' };
  const fries = { id: '5', name: 'apples', category: 'Appetizer' };
  const masterItems = [food, burger, hoegarden, heineken, fries];
  const onSelectMasterItem = spy();
  const component = renderIntoDocument(MasterItemsSelect({ masterItems, onSelectMasterItem }));

  return {
    component,
    masterItems,
    onSelectMasterItem,
    items: scryRenderedDOMComponentsWithClass(component, 'item'),
    categories: scryRenderedDOMComponentsWithClass(component, 'category'),
    selectCategory: findRenderedDOMComponentWithClass(component, 'select-category'),
    selectItem: findRenderedDOMComponentWithClass(component, 'select-item')
  };
}

describe('Master Items Select', () => {
  it('renders button when item is selected', () => {
    const { items, component } = setup();
    const addItemBtn = scryRenderedDOMComponentsWithClass(component, 'add-entry-apples');

    expect(addItemBtn.length).to.equal(1);
  });

  it('renders an option for items in the first category in alphabetical order', () => {
    const { items } = setup();

    expect(items.length).to.equal(2);
    expect(items[0].textContent).to.contain('apple');
    expect(items[1].textContent).to.contain('food');
  });

  it('renders the unique categories for the items', () => {
    const { categories } = setup();

    expect(categories.length).to.equal(3);
  });

  it('filters the option based on selected category', () => {
    const { component, selectCategory } = setup();
    const selectBeer = findRenderedDOMComponentWithClass(component, 'category-Beer');
    Simulate.click(selectBeer);
    const filteredItems = scryRenderedDOMComponentsWithClass(component, 'item');

    expect(filteredItems.length).to.equal(2);
    expect(filteredItems[0].textContent).to.contain('heineken');
    expect(filteredItems[1].textContent).to.contain('hoegarden');
  });
});

