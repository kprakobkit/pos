import { Component, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import Order from './Order';
import * as actionCreators from '../action_creators';

const order = createFactory(Order);

function mapStateToProps(state) {
  return {
    orders: state.get('orders')
  };
}

class Orders extends Component {
  constructor(props) {
    super(props);
    this.renderOrder = this.renderOrder.bind(this);
  }

  renderOrder(orderData) {
    return order(
      Object.assign(
        {},
        orderData,
        { key: orderData.id, toggleOrder: this.props.toggleOrder }
      )
    );
  }

  render() {
    return (
      dom.div(
        null,
        dom.h1({ className: 'orders-title' }, 'Orders'),
        this.props.orders && this.props.orders.size ?
          this.props.orders.toJS().map(this.renderOrder) :
          dom.div({ className: 'orders-message' }, 'There are currently no orders.')
      )
    );
  }
}

export default Orders;
export const OrdersContainer = connect(
  mapStateToProps,
  actionCreators
)(Orders);
