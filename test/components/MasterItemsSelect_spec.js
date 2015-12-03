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
  const masterItems = [food, burger, hoegarden];
  const onSelectMasterItem = () => {};
  const component = renderIntoDocument(MasterItemsSelect({ masterItems, onSelectMasterItem }));

  return {
    component,
    masterItems,
    options: scryRenderedDOMComponentsWithClass(component, 'option'),
    categories: scryRenderedDOMComponentsWithClass(component, 'category')
  };
}

describe('Master Items Select', () => {
  it('renders an option for items', () => {
    const { options } = setup();

    expect(options.length).to.equal(3);
  });

  it('renders the unique categories for the items', () => {
    const { categories } = setup();

    expect(categories.length).to.equal(3);
  });
});

