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
  const fries = { id: '5', name: 'fries', category: 'Appetizer' };
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
  it('renders an option for items in the first category', () => {
    const { items } = setup();

    expect(items.length).to.equal(2);
  });

  it('renders the unique categories for the items', () => {
    const { categories } = setup();

    expect(categories.length).to.equal(3);
  });

  it('filters the option based on selected category', () => {
    const { component, selectCategory } = setup();
    Simulate.change(selectCategory, { target: { value: 'Beer' } });
    const filteredItems = scryRenderedDOMComponentsWithClass(component, 'item');

    expect(filteredItems.length).to.equal(2);
    expect(filteredItems[0].text).to.equal('hoegarden');
    expect(filteredItems[1].text).to.equal('heineken');
  });

  it('defaults to the first item after changing category', () => {
    const { selectCategory, items, selectItem } = setup();
    Simulate.change(selectCategory, { target: { value: 'Beer' } });
    Simulate.change(selectItem, { target: { value: '4' } });
    Simulate.change(selectCategory, { target: { value: 'Appetizer' } });

    expect(items[0].selected).to.be.true;
  });

  it('calls onSelectMasterItem with the first item when selecting a category', () => {
    const { selectCategory, onSelectMasterItem } = setup();
    Simulate.change(selectCategory, { target: { value: 'Beer' } });

    expect(onSelectMasterItem).to.be.called();
    expect(onSelectMasterItem.__spy.calls[0][0].name).to.equal('hoegarden');
  });
});

