import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import constants from '../constants';
import moment from 'moment';
import EntryQueueComponent from './EntryQueue';
import _ from 'ramda';

const EntryQueue = createFactory(EntryQueueComponent);

function mapStateToProps(state) {
  return {
    orders: state.orders
  };
}

class Bartender extends Component {
  componentWillMount() {
    this.props.loadOrders();
  }

  render() {
    const isDrink = _.pathEq(['entry', 'type'], constants.DRINK);

    return EntryQueue({
      orders: this.props.orders,
      displayMax: 6,
      changeEntryStatus: this.props.changeEntryStatus,
      filterPredicate: isDrink
    });
  }
}

Bartender.propTypes = {
  orders: PropTypes.array.isRequired
};

Bartender.defaultProps = {
  orders: []
};

export default Bartender;
export const BartenderContainer = connect(
  mapStateToProps,
  actions
)(Bartender);
