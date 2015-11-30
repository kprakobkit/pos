import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import CloseOrderBtnComponent from './CloseOrderBtn';

const CloseOrderBtn = createFactory(CloseOrderBtnComponent);

class Payment extends Component {
  constructor(props) {
    super(props);
    this.calculateBalance = this.calculateBalance.bind(this);
    this.setCreditTip = this.setCreditTip.bind(this);
    this.renderAmountField = this.renderAmountField.bind(this);
    this.state = {
      balance: props.startingBalance,
      amountInputs: [],
      creditTip: 0
    };
  }

  calculateBalance() {
    const paid = this.state.amountInputs.reduce((total, input) => {
      return total + parseFloat(input.value || 0);
    }, 0);

    this.setState({ balance: this.props.startingBalance - paid });
  }

  setCreditTip(e) {
    this.setState({ creditTip: e.target.value });
  }

  allInputAmounts() {
    const amounts = this.state.amountInputs.map((input) => input.value).concat(this.state.creditTip);
    return amounts;
  }

  componentDidMount() {
    const amountInputs = Array.from(this.refs.form.querySelectorAll('.payment-amount-input'));
    this.setState({ amountInputs });
  }

  renderAmountField(towardsBalance) {
    return (label) => {
      return dom.div(
        { className: 'form-group', key: label },
        dom.label({ className: 'control-label col-xs-6 h4' }, label),
        dom.div(
          { className: 'col-xs-6' },
          dom.input(
            {
              className: `${towardsBalance ? 'payment' : 'tip'}-amount-input form-control input-lg text-right`,
              type: 'number',
              onChange: towardsBalance ? this.calculateBalance : this.setCreditTip
            }
          )
        )
      );
    };
  }

  render() {
    return (
      dom.div(
        { className: 'payment-component' },
        dom.h2({ className: 'payment-component-heading' }, 'Amounts Paid'),
        dom.form(
          { className: 'payment-form form-horizontal', ref: 'form' },
          ['Cash', 'Credit'].map(this.renderAmountField(true)),
          dom.div(
            { className: 'payment-balance' },
            dom.div(
              { className: 'payment-balance-label col-xs-6 h3' },
              'Balance'
            ),
            dom.div(
              { className: 'payment-balance-amount col-xs-6 h3 text-right' },
              `$${this.state.balance.toFixed(2)}`
            )
          ),
          this.renderAmountField(false)('Tip in Credit')
        ),
        CloseOrderBtn(
          {
            shouldBeDisabled: this.state.balance !== 0,
            handleClick: this.props.setClosed.bind.apply(this.props.setClosed, [null].concat(this.allInputAmounts()))
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
