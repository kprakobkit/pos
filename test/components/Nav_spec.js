import { expect } from 'chai';
import { createFactory } from 'react';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import NavComponent from '../../src/components/Nav';

const { renderIntoDocument, findRenderedDOMComponentWithClass } = TestUtils;
function ContainerComponentFactory(childComponent) {
  class ContainerComponent extends React.Component {
    getChildContext() {
      return {
        location: {
          pathname: '/orders'
        }
      };
    }

    render() {
      return React.DOM.div(
        null,
        childComponent(this.props)
      );
    };
  }

  ContainerComponent.childContextTypes = {
    location: React.PropTypes.object
  };

  return ContainerComponent;
}

const Nav = createFactory(NavComponent);
const Container = createFactory(ContainerComponentFactory(Nav));

describe('Nav', () => {
  it('renders links to Home by default', () => {
    const component = renderIntoDocument(Container());
    const ordersLink = findRenderedDOMComponentWithClass(component, 'nav-home-link');

    expect(ordersLink.textContent).to.equal('Home');
  });

  it('renders links to orders when in the orders path', () => {
    const component = renderIntoDocument(Container());
    const ordersLink = findRenderedDOMComponentWithClass(component, 'nav-orders-link');

    expect(ordersLink.textContent).to.equal('Orders');
  });
});

