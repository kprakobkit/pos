import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import CloseOrderBtnComponent from './CloseOrderBtn';

const CloseOrderBtn = createFactory(CloseOrderBtnComponent);

class Payment extends Component {
  constructor(props) {
    super(props);
    this.updateBalance = this.updateBalance.bind(this);
    this.renderAmountField = this.renderAmountField.bind(this);
    this.state = {
      cash: 0,
      credit: 0,
      tip: 0
    };
  }

  balance() {
    return this.props.startingBalance - this.state.cash - this.state.credit;
  }

  updateBalance(field) {
    return (e) => {
      this.setState({ [field]: e.target.value * 100 });
    }.bind(this);
  }

  labelForField(field) {
    return {
      cash: 'Cash',
      credit: 'Credit',
      tip: 'Tip in Credit'
    }[field];
  }

  renderAmountField(field) {
    return dom.div(
      { className: 'form-group', key: field },
      dom.label({ className: 'control-label col-xs-6 h4' }, this.labelForField(field)),
      dom.div(
        { className: 'col-xs-6' },
        dom.input(
          {
            className: `${field}-amount-input form-control input-lg text-right`,
            type: 'number',
            onChange: this.updateBalance(field)
          }
        )
      )
    );
  }

  render() {
    return (
      dom.div(
        { className: 'payment-component' },
        dom.h2({ className: 'payment-component-heading' }, 'Amounts Paid'),
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
              `$${(this.balance() / 100).toFixed(2)}`
            )
          ),
          this.renderAmountField('tip')
        ),
        CloseOrderBtn(
          {
            shouldBeDisabled: this.balance() !== 0,
            handleClick: this.props.setClosed.bind(this, this.state)
          }
        )
      )
    );
  }
}

Payment.propTypes = {
  startingBalance: PropTypes.number.isRequired,
  setClosed: PropTypes.func.isRequired
};

export default Payment;
