import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import constants from '../constants';
import _ from 'underscore';
import EntryComponent from './Entry';
import PaymentComponent from './Payment';

const Entry = createFactory(EntryComponent);
const Payment = createFactory(PaymentComponent);

class ProcessingOrder extends Component {
  constructor(props) {
    super(props);
    this.renderEntry = this.renderEntry.bind(this);
  }

  subtotal() {
    return this.props.order.entries
      .filter((entry) => entry.status === constants.DELIVERED)
      .reduce((sum, entry) => sum + entry.price / 100, 0);
  }

  renderEntry(entry, i) {
    return entry.status !== constants.CANCELED ?
      Entry(
        _.extend({}, entry, {
          key: i,
          index: i,
          ofOpenOrder: false
        })
      ) :
      null;
  }

  render() {
    return (
      dom.div(
        { className: 'order-entries' },
        dom.table(
          { className: 'table table-striped' },
          dom.tbody(
            null,
            this.props.order.entries.map(this.renderEntry),
            dom.tr(
              { className: 'order-subtotal' },
              dom.td(null, dom.h2(null, 'Subtotal')),
              dom.td(),
              dom.td(null, dom.h2(null, `$${this.subtotal().toFixed(2)}`))
            )
          )
        ),
        Payment({ startingBalance: this.subtotal() })
      )
    );
  }
}

ProcessingOrder.propTypes = {
  order: PropTypes.object.isRequired
};

export default ProcessingOrder;
