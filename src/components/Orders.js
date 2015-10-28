import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import OrderComponent from './Order';
import * as actions from '../action_creators';
const Order = createFactory(OrderComponent);

function mapStateToProps(state) {
  return {
    orders: state.orders
  };
}

class Orders extends Component {
  constructor(props) {
    super(props);
    this.renderOrder = this.renderOrder.bind(this);
  }

  componentWillMount() {
    this.props.loadOrders();
  }

  renderOrder(order) {
    return Order(
      Object.assign({}, order, {
        key: order.id,
        toggleOrder: this.props.toggleOrder
      })
    );
  }

  render() {
    return (
      dom.div(
        null,
        dom.h1({ className: 'orders-title' }, 'Orders'),
        this.props.orders.length ?
          this.props.orders.map(this.renderOrder) :
          dom.div({ className: 'orders-message' }, 'There are currently no orders.')
      )
    );
  }
}

Orders.propTypes = {
  orders:      PropTypes.array.isRequired,
  toggleOrder: PropTypes.func.isRequired
};

Orders.defaultProps = {
  orders: []
};

export default Orders;
export const OrdersContainer = connect(
  mapStateToProps,
  actions
)(Orders);
