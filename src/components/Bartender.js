import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import constants from '../constants';
import moment from 'moment';
import OpenEntryQueueContainer from './OpenEntryQueue';
import _ from 'ramda';

const OpenEntryQueue = createFactory(OpenEntryQueueContainer);

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
    const isOpen = _.pathEq(['entry', 'status'], constants.OPEN);
    const isDrink = _.pathEq(['entry', 'type'], constants.DRINK);

    return OpenEntryQueue({
      orders: this.props.orders,
      displayMax: 6,
      changeEntryStatus: this.props.changeEntryStatus,
      filterPredicate: _.allPass([isOpen, isDrink])
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
