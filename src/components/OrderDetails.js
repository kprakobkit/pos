import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import _ from 'underscore';

function mapStateToProps(state) {
  return {
    orders: state.orders
  };
}

class OrderDetails extends Component {
  constructor(props) {
    super(props);
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
              this.state.order.entries.map((entry, i) => dom.tr(
                { className: 'order-entry', key: i + 1 },
                dom.td({ className: 'entry-name' }, dom.h2(null, entry.name)),
                dom.td({ className: 'entry-comment' }, dom.h3(null, entry.comment)),
                dom.td({ className: 'entry-status' }, dom.h3(null, entry.status))
              ))
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
