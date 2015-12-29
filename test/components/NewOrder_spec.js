import { expect, spy } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import NewOrderComponent from '../../src/components/NewOrder';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;


const pushState = spy();

function ContainerComponentFactory(childComponent) {
  class ContainerComponent extends React.Component {
    getChildContext() {
      return {
        history: {
          pushState,
          createHref: () => {}
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
    history: React.PropTypes.object
  };

  return ContainerComponent;
}

function setup() {
  const food = { id: '1', name: 'food' };
  const burger = { id: '2', name: 'burger' };
  const masterItems = [food, burger];
  const loadItems = () => {};
  const addOrder = spy();
  const NewOrder = React.createFactory(NewOrderComponent);
  const Container = React.createFactory(ContainerComponentFactory(NewOrder));
  const component = renderIntoDocument(Container({ masterItems, loadItems, addOrder }));

  return {
    component,
    addBurger: findRenderedDOMComponentWithClass(component, 'add-entry-burger'),
    selectItem: findRenderedDOMComponentWithClass(component, 'select-item'),
    submitOrder: findRenderedDOMComponentWithClass(component, 'submit-order'),
    selectTableNumber: findRenderedDOMComponentWithClass(component, 'table-numbers'),
    addOrder,
    burger,
    food
  };
}

describe('New Order', () => {
  it('removes an item from an order', () => {
    const { selectItem, component, addBurger, burger } = setup();
    Simulate.change(selectItem, { target: { value: burger.id } });
    Simulate.click(addBurger);
    const removeEntry = findRenderedDOMComponentWithClass(component, 'remove-entry');
    Simulate.click(removeEntry);
    const entries = scryRenderedDOMComponentsWithClass(component, 'entries');

    expect(entries.length).to.equal(0);
  });

  it('adds an order on submit and redirects to orders page', () => {
    const { selectItem, component, addBurger, submitOrder, addOrder, burger, selectTableNumber } = setup();
    Simulate.change(selectTableNumber, { target: { value: 2 } });
    Simulate.change(selectItem, { target: { value: burger.id } });
    Simulate.click(addBurger);
    Simulate.click(submitOrder);

    expect(addOrder.__spy.calls[0][0]).to.equal(2);
    expect(addOrder.__spy.calls[0][1].length).to.equal(1);
    expect(addOrder.__spy.calls[0][1]).to.deep.equal([{ name: burger.name, id: burger.id }]);
    expect(pushState).to.have.been.called.with(null, '/orders');
  });
});
