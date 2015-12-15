import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import CloseOrderBtnComponent from './CloseOrderBtn';
import $ from '../money';
import _ from 'ramda';
import util from '../util';

const CloseOrderBtn = createFactory(CloseOrderBtnComponent);

class PaymentForm extends Component {
  constructor(props) {
    super(props);
    this.exceedsTotal = this.exceedsTotal.bind(this);
    this.updateAmount = this.updateAmount.bind(this);
    this.closeOrder = this.closeOrder.bind(this);
    this.buttonText = this.buttonText.bind(this);
    this.renderAmountField = this.renderAmountField.bind(this);
    this.state = {
      cash: props.cash,
      credit: props.credit,
      tip: props.tip
    };
  }

  exceedsTotal(payment) {
    return _.gt(payment, this.props.startingBalance);
  }

  updateAmount(field) {
    return (e) => {
      this.setState({ [field]: $.cents(e.target.value) });
    }.bind(this);
  }

  closeOrder() {
    const cash = _.max(this.props.startingBalance - this.state.credit, 0);
    const amounts = _.merge(this.state, { cash });
    this.props.setClosed(amounts);
  }

  buttonText() {
    return _.cond([
      [this.exceedsTotal, _.always('Payment Cannot Exceed Total')],
      [_.equals(0),       _.always('All Paid in Cash')]
    ])(this.state.credit);
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
            placeholder: $.dollars(this.state[field]),
            onChange: this.updateAmount(field)
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
          ['credit', 'tip'].map(this.renderAmountField)
        ),
        CloseOrderBtn(
          {
            shouldBeDisabled: this.exceedsTotal(this.state.credit),
            handleClick: this.closeOrder,
            text: this.buttonText()
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
