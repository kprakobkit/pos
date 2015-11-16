import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import _ from 'underscore';
import EntryComponent from './Entry';

const Entry = createFactory(EntryComponent);

function mapStateToProps(state) {
  return {
    orders: state.orders
  };
}

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.renderEntry = this.renderEntry.bind(this);
    this.state = {
      order: {
        entries: {}
      }
    };
  }

  componentWillMount() {
    const order = _.find(this.props.orders, { id: this.props.params.id });
    this.setState({ order });
  }

  componentWillReceiveProps(props) {
    const order = _.find(props.orders, { id: this.props.params.id });
    this.setState({ order });
  }

  renderEntry(entry, i) {
    return Entry(
      _.extend({}, entry, {
        key: i,
        index: i,
        changeEntryStatus: this.props.changeEntryStatus.bind(null, this.props.params.id)
      })
    );
  }

  render() {
    return (
      dom.div(
        null,
        dom.h1({ className: 'order-title' }, `Order #${this.props.params.id}`),
        dom.h2({ className: 'order-status' }, `Status: ${this.state.order.status}`),
        dom.div(
          { className: 'order-entries' },
          dom.table(
            { className: 'table table-striped' },
            dom.tbody(
              null,
              this.state.order.entries.map(this.renderEntry)
            )
          )
        )
      )
    );
  }
}

OrderDetails.propTypes = {
  orders: PropTypes.array.isRequired
};

OrderDetails.defaultProps = {
  orders: []
};

export default OrderDetails;
export const OrderDetailsContainer = connect(
  mapStateToProps,
  actions
)(OrderDetails);
