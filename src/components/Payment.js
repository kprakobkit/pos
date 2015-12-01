import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import PaymentFormComponent from './PaymentForm';
import $ from '../money';
import _ from 'underscore';

const PaymentForm = createFactory(PaymentFormComponent);

class Payment extends Component {
  render() {
    return (
      dom.div(
        { className: 'payment-component' },
        dom.h2({ className: 'payment-component-heading' }, 'Amounts Paid'),
        PaymentForm(_.extend({}, this.props.transaction, {
          setClosed: this.props.setClosed,
          startingBalance: this.props.startingBalance
        }))
      )
    );
  }
}

Payment.propTypes = {
  startingBalance: PropTypes.number.isRequired,
  transaction: PropTypes.object,
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
