import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import $ from '../money';
import util from '../util';
import ReadyForBillBtnComponent from './ReadyForBillBtn';

const ReadyForBillBtn = createFactory(ReadyForBillBtnComponent);

class PaymentSummary extends Component {
  constructor(props) {
    super(props);
    this.renderPaymentAmount = this.renderPaymentAmount.bind(this);
  }

  renderPaymentAmount(field) {
    return dom.tr(
      { className: 'form-group', key: field },
      dom.td(null, dom.h3(null, util.labelForField(field))),
      dom.td(
        { className: `${field}-amount-paid text-right` },
        dom.h3(null, $.format(this.props[field]))
      )
    );
  }

  render() {
    return (
      dom.div(
        null,
        dom.table(
          { className: 'payment-summary table table-striped' },
          dom.tbody(
            null,
            ['cash', 'credit', 'tip'].map(this.renderPaymentAmount)
          )
        ),
        ReadyForBillBtn({
          entries: [],
          overrideHidden: true,
          text: 'Edit Payment Information',
          handleOnClick: this.props.setReadyForBill
        })
      )
    );
  }
}

PaymentSummary.propTypes = {
  cash: PropTypes.number.isRequired,
  credit: PropTypes.number.isRequired,
  tip: PropTypes.number.isRequired,
  setReadyForBill: PropTypes.func.isRequired
};

export default PaymentSummary;
