import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import HomeComponent from '../../src/components/Home';

const { renderIntoDocument, findRenderedDOMComponentWithClass } = TestUtils;
const Home = React.createFactory(HomeComponent);

describe('Home', () => {
  it('renders link to orders page', () => {
    const component = renderIntoDocument(Home());
    const link = findRenderedDOMComponentWithClass(component, 'orders-link');

    expect(link.textContent).to.equal('Orders');
  });
});

