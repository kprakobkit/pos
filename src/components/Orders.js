import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import OrderComponent from './Order';
import * as actionCreators from '../action_creators';
import { List } from 'immutable';

const Order = createFactory(OrderComponent);

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

  renderOrder(order) {
    return Order(
      Object.assign(
        {},
        order,
        { key: order.id, toggleOrder: this.props.toggleOrder }
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

Orders.propTypes = {
  orders:      PropTypes.instanceOf(List),
  toggleOrder: PropTypes.func.isRequired
};

export default Orders;
export const OrdersContainer = connect(
  mapStateToProps,
  actionCreators
)(Orders);
