import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import CloseOrderBtnComponent from './CloseOrderBtn';
import $ from '../money';
import util from '../util';

const CloseOrderBtn = createFactory(CloseOrderBtnComponent);

class PaymentForm extends Component {
  constructor(props) {
    super(props);
    this.updateBalance = this.updateBalance.bind(this);
    this.renderAmountField = this.renderAmountField.bind(this);
    this.state = {
      cash: props.cash,
      credit: props.credit,
      tip: props.tip
    };
  }

  balance() {
    return this.props.startingBalance - this.state.cash - this.state.credit;
  }

  updateBalance(field) {
    return (e) => {
      this.setState({ [field]: $.cents(e.target.value) });
    }.bind(this);
  }

  renderAmountField(field) {
    return dom.div(
      { className: 'form-group', key: field },
      dom.label({ className: 'control-label col-xs-6 h4' }, util.labelForField(field)),
      dom.div(
        { className: 'col-xs-6' },
        dom.input(
          {
            className: `${field}-amount-input form-control input-lg text-right`,
            type: 'number',
            defaultValue: $.dollars(this.state[field]),
            onChange: this.updateBalance(field)
          }
        )
      )
    );
  }

  render() {
    return (
      dom.div(
        null,
        dom.form(
          { className: 'payment-form form-horizontal', ref: 'form' },
          ['cash', 'credit'].map(this.renderAmountField),
          dom.div(
            { className: 'payment-balance' },
            dom.div(
              { className: 'payment-balance-label col-xs-6 h3' },
              'Balance'
            ),
            dom.div(
              { className: 'payment-balance-amount col-xs-6 h3 text-right' },
              $.format(this.balance())
            )
          ),
          this.renderAmountField('tip')
        ),
        CloseOrderBtn(
          {
            shouldBeDisabled: this.balance() !== 0,
            handleClick: this.props.setClosed.bind(null, this.state)
          }
        )
      )
    );
  }
}

PaymentForm.propTypes = {
  startingBalance: PropTypes.number.isRequired,
  cash: PropTypes.number.isRequired,
  credit: PropTypes.number.isRequired,
  tip: PropTypes.number.isRequired,
  setClosed: PropTypes.func.isRequired
};

export default PaymentForm;
