import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import CloseOrderBtnComponent from './CloseOrderBtn';
import $ from '../money';
import _ from 'ramda';
import util from '../util';

const CloseOrderBtn = createFactory(CloseOrderBtnComponent);

class PaymentForm extends Component {
  constructor(props) {
    super(props);
    this.updateAmount = this.updateAmount.bind(this);
    this.closeOrder = this.closeOrder.bind(this);
    this.renderAmountField = this.renderAmountField.bind(this);
    this.state = {
      cash: props.cash,
      credit: props.credit,
      tip: props.tip
    };
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
            shouldBeDisabled: this.state.credit === 0,
            handleClick: this.closeOrder
          }
        ),
        dom.button(
          {
            className: 'btn btn-success btn-lg btn-block',
            disabled: this.state.credit !== 0,
            onClick: this.closeOrder
          },
          'All Paid in Cash'
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
