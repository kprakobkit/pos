import { expect }    from 'chai';
import proxyquire    from 'proxyquire';
import React         from 'react';
import ReactDOM      from 'react-dom';
import TestUtils     from 'react-addons-test-utils';
import { List, Map } from 'immutable';
import Orders        from '../../src/components/Orders';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass
} = TestUtils;

const orders = React.createFactory(Orders);

describe('Orders', () => {
  it('renders title', () => {
    const component = renderIntoDocument(orders({ orders: List() }));
    const title = findRenderedDOMComponentWithClass(component, 'orders-title');

    expect(title.textContent).to.equal('Orders');
  });

  it('renders Order component for each order in props', () => {
    const order1 = Map({ id: 1, status: 'open' });
    const order2 = Map({ id: 2, status: 'open' });
    const order3 = Map({ id: 3, status: 'open' });
    const ordersProp = List.of(order1, order2, order3);
    const component = renderIntoDocument(orders({ orders: ordersProp }));
    const children = scryRenderedDOMComponentsWithClass(component, 'order');

    expect(children.length).to.equal(3);
  });
});
