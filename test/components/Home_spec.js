import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Home from '../../src/components/Home';

const { renderIntoDocument, findRenderedDOMComponentWithClass } = TestUtils;
const home = React.createFactory(Home);

describe('Home', () => {
  it('renders link to orders page', () => {
    const component = renderIntoDocument(home());
    const link = findRenderedDOMComponentWithClass(component, 'orders-link');

    expect(link.textContent).to.equal('Orders');
  });
});

