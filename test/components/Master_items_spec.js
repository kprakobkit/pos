import { expect, spy } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import MasterItemsComponent from '../../src/components/MasterItems';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const MasterItems = React.createFactory(MasterItemsComponent);

describe('Master Items', () => {
  const food = { id: '1', name: 'food' };
  const burger = { id: '2', name: 'burger' };
  const masterItems = [food, burger];
  const onSelectMasterItem = {};

  it('renders an option for items in the list', () => {
    const component = renderIntoDocument(MasterItems({ masterItems, onSelectMasterItem }));
    const options = scryRenderedDOMComponentsWithClass(component, 'option');

    expect(options.length).to.equal(masterItems.length);
  });
});

