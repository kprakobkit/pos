import { Component, PropTypes, DOM as dom } from 'react';
import actions from '../action_creators';
import constants from '../constants';

class Filter extends Component {
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
            `filter-option filter-${normalized}`,
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
        { className: 'filter' },
        this.props.filters.map(this.renderFilter)
      )
    );
  }
}

Filter.propTypes = {
  filterOrders: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired
};

export default Filter;
