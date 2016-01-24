import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import constants from '../constants';
import $ from '../money';
import _ from 'ramda';
import EntryBillComponent from './EntryBill';
import PaymentComponent from './Payment';
import ApplyDiscountComponent from './ApplyDiscount';
import ModalComponent from 'react-modal';

const EntryBill = createFactory(EntryBillComponent);
const Payment = createFactory(PaymentComponent);
const Modal = createFactory(ModalComponent);
const ApplyDiscount = createFactory(ApplyDiscountComponent);

class ProcessingOrder extends Component {
  constructor(props) {
    super(props);
    this.renderEntry = this.renderEntry.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      modalIsOpen: false
    };
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

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const { entries, discounts, status } = this.props.order;
    const isClosedOrCanceled = entry => entry.status != constants.CANCELED && entry.status != constants.CLOSED;
    const groupedEntries = this.groupEntries(_.filter(isClosedOrCanceled, entries));

    return (
      dom.div(
        { className: 'order-entries' },
        dom.table(
          { className: 'table table-striped' },
          dom.tbody(
            null,
            dom.tr(
              null,
              dom.th(null, 'Item'),
              dom.th(null, 'Quantity'),
              dom.th(
                { className: 'text-right' },
                status === constants.READY_FOR_BILL ?
                  dom.button(
                    {
                      className: 'btn btn-default apply-discount',
                      onClick: this.openModal
                    }, 'Discount'
                ) : null
              )
            ),
            groupedEntries.map(this.renderEntry),
            discounts.length > 0 ?
              dom.tr(
                { className: 'order-discount' },
                dom.td(null, dom.p(null, dom.strong(null, 'Discount'))),
                dom.td(),
                dom.td(
                  { className: 'text-right' },
                  dom.p(
                    null,
                    null,
                    `- ${ $.format($.discount(this.props.order)) }`
                  )
                )
            ) : null,
            dom.tr(
              { className: 'order-subtotal' },
              dom.td(null, dom.h2(null, 'Subtotal')),
              dom.td(),
              dom.td(
                { className: 'text-right' },
                dom.h2(null, $.format($.subtotal(this.props.order))),
              )
            ),
            dom.tr(
              { className: 'order-tax' },
              dom.td(null, dom.h2(null, 'Tax')),
              dom.td(),
              dom.td({ className: 'text-right' }, dom.h2(null, $.format($.tax(this.props.order))))
            ),
            dom.tr(
              { className: 'order-total' },
              dom.td(null, dom.h2(null, 'Total')),
              dom.td(),
              dom.td({ className: 'text-right' }, dom.h2(null, $.format($.total(this.props.order))))
            )
          )
        ),
        Payment(
          {
            startingBalance: $.total(this.props.order),
            transaction: this.props.order.transaction,
            orderStatus: this.props.order.status,
            setClosed: this.props.setClosed,
            setReadyForBill: this.props.setReadyForBill
          }
        ),
        Modal(
          {
            className: 'modal-dialog',
            isOpen: this.state.modalIsOpen,
            onRequestClose: this.closeModal,
            style: {
              content: {
                border: 0,
                background: 'none'
              }
            }
          },
          ApplyDiscount({
            closeModal: this.closeModal,
            appliedDiscounts: this.props.order.discounts,
            masterDiscounts: this.props.discounts,
            saveDiscounts: this.props.saveDiscounts
          })
        )
      )
    );
  }
}

ProcessingOrder.propTypes = {
  order: PropTypes.object.isRequired,
  setClosed: PropTypes.func.isRequired,
  setReadyForBill: PropTypes.func.isRequired,
  discounts: PropTypes.array.isRequired
};

export default ProcessingOrder;
