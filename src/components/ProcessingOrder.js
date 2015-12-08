import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import constants from '../constants';
import $ from '../money';
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
      .reduce((sum, entry) => sum + entry.price, 0);
  }

  tax() {
    return this.subtotal() * constants.TAX_RATE;
  }

  total() {
    return this.subtotal() + this.tax();
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
              dom.td({ className: 'text-right' }, dom.h2(null, $.format(this.subtotal())))
            ),
            dom.tr(
              { className: 'order-tax' },
              dom.td(null, dom.h2(null, 'Tax')),
              dom.td(),
              dom.td({ className: 'text-right' }, dom.h2(null, $.format(this.tax())))
            ),
            dom.tr(
              { className: 'order-total' },
              dom.td(null, dom.h2(null, 'Total')),
              dom.td(),
              dom.td({ className: 'text-right' }, dom.h2(null, $.format(this.total())))
            )
          )
        ),
        Payment(
          {
            startingBalance: this.subtotal(),
            transaction: this.props.order.transaction,
            orderStatus: this.props.order.status,
            setClosed: this.props.setClosed,
            setReadyForBill: this.props.setReadyForBill
          }
        )
      )
    );
  }
}

ProcessingOrder.propTypes = {
  order: PropTypes.object.isRequired,
  setClosed: PropTypes.func.isRequired,
  setReadyForBill: PropTypes.func.isRequired
};

export default ProcessingOrder;
