import { Component, PropTypes, DOM as dom, createFactory } from 'react';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.calculateBalance = this.calculateBalance.bind(this);
    this.renderAmountField = this.renderAmountField.bind(this);
    this.state = {
      balance: props.startingBalance,
      amountInputs: []
    };
  }

  calculateBalance() {
    const paid = this.state.amountInputs.reduce((total, input) => {
      return total + parseFloat(input.value || 0);
    }, 0);

    this.setState({ balance: this.props.startingBalance - paid });
  }

  componentDidMount() {
    const amountInputs = Array.from(this.refs.form.querySelectorAll('input'));
    this.setState({ amountInputs });
  }

  renderAmountField(label) {
    return dom.div(
      { className: 'form-group', key: label },
      dom.label({ className: 'control-label col-xs-6 h4' }, label),
      dom.div(
        { className: 'col-xs-6' },
        dom.input(
          {
            className: 'form-control input-lg text-right',
            type: 'number',
            onChange: this.calculateBalance
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
          ['Cash', 'Credit'].map(this.renderAmountField),
        ),
        dom.div(
          { className: 'payment-balance' },
          dom.div(
            { className: 'payment-balance-label col-xs-6 h3' },
            'Balance'
          ),
          dom.div(
            { className: 'col-xs-6 h3 text-right' },
            `$${this.state.balance.toFixed(2)}`
          )
        )
      )
    );
  }
}

export default Payment;
