import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import PaymentFormComponent from './PaymentForm';
import PaymentSummaryComponent from './PaymentSummary';
import constants from '../constants';
import $ from '../money';
import _ from 'underscore';

const PaymentForm = createFactory(PaymentFormComponent);
const PaymentSummary = createFactory(PaymentSummaryComponent);

class Payment extends Component {
  render() {
    return (
      dom.div(
        { className: 'payment-component' },
        dom.h2({ className: 'payment-component-heading' }, 'Amounts Paid'),
        this.props.orderStatus === constants.READY_FOR_BILL ?
          PaymentForm(_.extend({}, this.props.transaction, {
            setClosed: this.props.setClosed,
            startingBalance: this.props.startingBalance
          })) :
          PaymentSummary(this.props.transaction)
      )
    );
  }
}

Payment.propTypes = {
  startingBalance: PropTypes.number.isRequired,
  transaction: PropTypes.object,
  orderStatus: PropTypes.string.isRequired,
  setClosed: PropTypes.func.isRequired
};

Payment.defaultProps = {
  transaction: {
    cash: 0,
    credit: 0,
    tip: 0
  }
};

export default Payment;
