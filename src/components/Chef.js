import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import constants from '../constants';
import moment from 'moment';
import EntryQueueContainer from './EntryQueue';
import _ from 'ramda';

const EntryQueue = createFactory(EntryQueueContainer);

function mapStateToProps(state) {
  return {
    orders: state.orders
  };
}

class Chef extends Component {
  componentWillMount() {
    this.props.loadOrders();
  }

  render() {
    const isFood = _.pathEq(['entry', 'type'], constants.FOOD);

    return EntryQueue({
      orders: this.props.orders,
      displayMax: 6,
      changeEntryStatus: this.props.changeEntryStatus,
      filterPredicate: isFood
    });
  }
}

Chef.propTypes = {
  orders: PropTypes.array.isRequired
};

Chef.defaultProps = {
  orders: []
};

export default Chef;
export const ChefContainer = connect(
  mapStateToProps,
  actions
)(Chef);
