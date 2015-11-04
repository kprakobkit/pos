import { Component, PropTypes, DOM as dom } from 'react';
import actions from '../action_creators';
import constants from '../constants';

class OrdersFilter extends Component {
  render() {
    return (
      dom.div(
        null,
        dom.button(
          {
            className: 'orders-filter-option orders-filter-all',
            onClick:   () => this.props.filterOrders(constants.ALL)
          },
          'All'
        ),
        dom.button(
          {
            className: 'orders-filter-option orders-filter-open',
            onClick:   () => this.props.filterOrders(constants.OPEN)
          },
          'Open'
        ),
        dom.button(
          {
            className: 'orders-filter-option orders-filter-ready',
            onClick:   () => this.props.filterOrders(constants.READY_FOR_BILL)
          },
          'Ready for Bill'
        ),
      )
    );
  }
}

OrdersFilter.propTypes = {
  filterOrders: PropTypes.func.isRequired
};

export default OrdersFilter;
