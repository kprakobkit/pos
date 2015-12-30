import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import constants from '../constants';
import OrderComponent from './Order';
import FilterComponent from './Filter';
import { Link as LinkComponent } from 'react-router';
import _ from 'underscore';

const Order = createFactory(OrderComponent);
const Filter = createFactory(FilterComponent);
const Link = createFactory(LinkComponent);

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
    this.state = { filter: constants.OPEN };
  }

  componentWillMount() {
    this.props.loadOrders();
    this.props.loadItems();
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

  printOrderStatus(status) {
    return status.replace(/_/g, ' ').toLowerCase();
  }

  renderOrder(order) {
    return Order(
      _.extend({}, order, {
        key: order.id,
        printOrderStatus: this.printOrderStatus
      })
    );
  }

  render() {
    return (
      dom.div(
        null,
        dom.div(
          { className: 'row' },
          dom.div(
            { className: 'col-xs-6' },
            Filter(
              {
                filter: this.state.filter,
                filterOrders: this.filterOrders,
                printOrderStatus: this.printOrderStatus,
                filters: [constants.OPEN, constants.READY_FOR_BILL, constants.ALL]
              }
            ),
          ),
          Link(
            { to: '/orders/new', className: 'col-xs-6 text-right' },
            dom.p(
              null,
              dom.button(
                { className: 'btn btn-success btn-lg' },
                'Add new order'
              )
            )
          )
        ),
        dom.div(
          null,
          this.props.orders.length ?
            dom.table(
              { className: 'table table-hover' },
              dom.tbody(
                null,
                this.getFilteredOrders().map(this.renderOrder)
              )
          ) : dom.div({ className: 'orders-message' }, 'There are currently no orders.')
        )
      )
    );
  }
}

Orders.propTypes = {
  orders:      PropTypes.array.isRequired
};

Orders.defaultProps = {
  orders: []
};

export default Orders;
export const OrdersContainer = connect(
  mapStateToProps,
  actions
)(Orders);
