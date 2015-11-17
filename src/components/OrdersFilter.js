import { Component, PropTypes, DOM as dom } from 'react';
import actions from '../action_creators';
import constants from '../constants';

class OrdersFilter extends Component {
  constructor(props) {
    super(props);
    this.renderFilter = this.renderFilter.bind(this);
  }

  isSelectedFilter(filter) {
    return this.props.filter === filter ? 'btn-primary' : 'btn-default';
  }

  renderFilter(filter) {
    const normalized = filter.toLowerCase().split('_')[0];
    return (
      dom.button(
        {
          key: filter,
          className: [
            `orders-filter-option orders-filter-${normalized}`,
            `btn ${this.isSelectedFilter(filter)} text-capitalize`
          ].join(' '),
          onClick: () => this.props.filterOrders(filter)
        },
        this.props.printOrderStatus(filter)
      )
    );
  }

  render() {
    return (
      dom.div(
        { className: 'orders-filter text-center' },
        [constants.ALL, constants.OPEN, constants.READY_FOR_BILL].map(this.renderFilter)
      )
    );
  }
}

OrdersFilter.propTypes = {
  filterOrders: PropTypes.func.isRequired
};

export default OrdersFilter;
