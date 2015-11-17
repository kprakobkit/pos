import { expect } from 'chai';
import { Component, DOM as dom, createFactory } from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import OrderComponent from '../../src/components/Order';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;
const Order = createFactory(OrderComponent);

class TableComponent extends Component {
  render() {
    return dom.table(
      null,
      dom.tbody(
        null,
        Order(this.props)
      )
    );
  };
}

const Table = createFactory(TableComponent);

describe('Order', () => {
  const id = '1';
  const status = constants.OPEN.toLowerCase();
  const printOrderStatus = (status) => status;

  it('renders id', () => {
    const props = { id, status, printOrderStatus };
    const component = renderIntoDocument(Table(props));
    const orderId = findRenderedDOMComponentWithClass(component, 'order-number');

    expect(orderId.textContent).to.contain(id.toString());
  });

  it('renders status', () => {
    const props = { id, status, printOrderStatus };
    const component = renderIntoDocument(Table(props));
    const orderStatus = findRenderedDOMComponentWithClass(component, 'order-status');

    expect(orderStatus.textContent).to.contain(status);
  });
});
