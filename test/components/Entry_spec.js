import { expect } from 'chai';
import { Component, DOM as dom, createFactory } from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import tableComponentFactory from './table_component_factory';
import EntryComponent from '../../src/components/Entry';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;
const Entry = createFactory(EntryComponent);
const Table = createFactory(tableComponentFactory(Entry));

describe('Entry', () => {
  const name = 'Pho';
  const status = constants.OPEN;
  const comment = 'extra soup';
  const props = { name, status, comment };
  const component = renderIntoDocument(Table(props));

  it('renders name and comment', () => {
    const entryName = findRenderedDOMComponentWithClass(component, 'entry-name');
    const entryComment = findRenderedDOMComponentWithClass(component, 'entry-comment');

    expect(entryName.textContent).to.equal(name);
    expect(entryComment.textContent).to.equal(comment);
  });
});
