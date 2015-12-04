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
  const masterItems = [food, burger, hoegarden, heineken];
  const onSelectMasterItem = spy();
  const component = renderIntoDocument(MasterItemsSelect({ masterItems, onSelectMasterItem }));

  return {
    component,
    masterItems,
    onSelectMasterItem,
    options: scryRenderedDOMComponentsWithClass(component, 'option'),
    categories: scryRenderedDOMComponentsWithClass(component, 'category'),
    selectCategory: findRenderedDOMComponentWithClass(component, 'categories')
  };
}

describe('Master Items Select', () => {
  it('renders an option for items in the first category', () => {
    const { options } = setup();

    expect(options.length).to.equal(1);
  });

  it('renders the unique categories for the items', () => {
    const { categories } = setup();

    expect(categories.length).to.equal(3);
  });

  it('filters the option based on selected category', () => {
    const { component, categories, selectCategory } = setup();
    Simulate.change(selectCategory, { target: { value: 'Beer' } });
    const filteredOptions = scryRenderedDOMComponentsWithClass(component, 'option');

    expect(filteredOptions.length).to.equal(2);
    expect(filteredOptions[0].text).to.equal('hoegarden');
    expect(filteredOptions[1].text).to.equal('heineken');
  });

  it('calls onSelectMasterItem with the first item when selecting a category', () => {
    const { component, selectCategory, onSelectMasterItem } = setup();
    Simulate.change(selectCategory, { target: { value: 'Beer' } });

    expect(onSelectMasterItem).to.be.called();
    expect(onSelectMasterItem.__spy.calls[0][0].name).to.equal('hoegarden');
  });
});

