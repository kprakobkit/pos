import { expect } from 'chai';
import { createFactory } from 'react';
import TestUtils from 'react-addons-test-utils';
import NavComponent from '../../src/components/Nav';

const { renderIntoDocument, findRenderedDOMComponentWithClass } = TestUtils;
const Nav = createFactory(NavComponent);

describe('Nav', () => {
  it('renders links to orders and chef pages', () => {
    const component = renderIntoDocument(Nav());
    const ordersLink = findRenderedDOMComponentWithClass(component, 'nav-orders-link');
    const chefLink = findRenderedDOMComponentWithClass(component, 'nav-chef-link');

    expect(ordersLink.textContent).to.equal('Orders');
    expect(chefLink.textContent).to.equal('Chef');
  });
});

