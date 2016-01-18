import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import constants from '../constants';
import $ from '../money';
import _ from 'ramda';
import EntryBillComponent from './EntryBill';
import PaymentComponent from './Payment';

const EntryBill = createFactory(EntryBillComponent);
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
    return Math.round(this.subtotal() * constants.TAX_RATE);
  }

  discount() {
    const percentage = this.props.order.discounts.reduce((sum, discount) => sum + discount.value, 0);
    return this.subtotal() * percentage;
  }

  total() {
    const discount = this.props.order.discounts.length > 0 ? this.discount() : 0;
    return this.subtotal() - discount + this.tax();
  }

  renderEntry(entry, i) {
    return EntryBill(
      _.merge(entry, {
        key: i,
        index: i
      })
    );
  }

  groupEntries(entries) {
    const uniqEntries = _.uniqBy((entry) => entry.name, entries);
    const count = _.countBy((entry) => entry.name, entries);

    const groupedEntries = uniqEntries.map(({ name, price }) => ({
      name,
      quantity: count[name],
      price
    }));

    return groupedEntries;
  }

  render() {
    const { entries, discounts } = this.props.order;
    const isClosedOrCanceled = entry => entry.status != constants.CANCELED && entry.status != constants.CLOSED;
    const groupedEntries = this.groupEntries(_.filter(isClosedOrCanceled, entries));

    return (
      dom.div(
        { className: 'order-entries' },
        dom.table(
          { className: 'table table-striped' },
          dom.tbody(
            null,
            groupedEntries.map(this.renderEntry),
            dom.tr(
              { className: 'order-subtotal' },
              dom.td(null, dom.h2(null, 'Subtotal')),
              dom.td(),
              dom.td({ className: 'text-right' }, dom.h2(null, $.format(this.subtotal())))
            ),
            discounts.length > 0 ? dom.tr(
              { className: 'order-discount' },
              dom.td(null, dom.h2(null, 'Discount')),
              dom.td(),
              dom.td({ className: 'text-right' }, dom.h2(null, $.format(this.discount())))
            ) : null,
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
            startingBalance: this.total(),
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
