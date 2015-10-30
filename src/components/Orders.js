import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import constants from '../constants';
import OrderComponent from './Order';
import OrdersFilterComponent from './OrdersFilter';

const Order = createFactory(OrderComponent);
const OrdersFilter = createFactory(OrdersFilterComponent);

function mapStateToProps(state) {
  return {
    orders: state.orders
  };
}

class Orders extends Component {
  constructor(props) {
    super(props);
    this.filterOrders = this.filterOrders.bind(this);
    this.renderOrder = this.renderOrder.bind(this);
    this.state = { filter: constants.ALL };
  }

  componentWillMount() {
    this.props.loadOrders();
  }

  filterOrders(filter) {
    this.setState({ filter });
  }

  getFilteredOrders() {
    if (this.state.filter === constants.ALL) {
      return this.props.orders;
    } else {
      return this.props.orders.filter((order) => order.status === this.state.filter);
    }
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
        OrdersFilter({ filterOrders: this.filterOrders }),
        this.props.orders.length ?
          this.getFilteredOrders().map(this.renderOrder) :
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
