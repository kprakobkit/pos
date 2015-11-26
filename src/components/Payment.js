import { Component, PropTypes, DOM as dom, createFactory } from 'react';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.renderAmountField = this.renderAmountField.bind(this);
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
            type: 'number'
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
      )
    );
  }
}

export default Payment;
