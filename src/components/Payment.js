import { Component, PropTypes, DOM as dom, createFactory } from 'react';

class Payment extends Component {
  render() {
    return (
      dom.div(
        { className: 'payment-component' },
        dom.h2({ className: 'payment-component-heading' }, 'Amounts Paid'),
        dom.form(
          { className: 'payment-form form-horizontal' },
          dom.div(
            { className: 'form-group' },
            dom.label({ className: 'control-label col-xs-6 h4' }, 'Cash'),
            dom.div(
              { className: 'col-xs-6' },
              dom.input({ className: 'form-control input-lg', type: 'number' })
            )
          ),
          dom.div(
            { className: 'form-group' },
            dom.label({ className: 'control-label col-xs-6 h4' }, 'Credit'),
            dom.div(
              { className: 'col-xs-6' },
              dom.input({ className: 'form-control input-lg', type: 'number' })
            )
          ),
          dom.div(
            { className: 'form-group' },
            dom.label({ className: 'control-label col-xs-6 h4' }, 'Tip in Credit'),
            dom.div(
              { className: 'col-xs-6' },
              dom.input({ className: 'form-control input-lg', type: 'number' })
            )
          )
        )
      )
    );
  }
}

export default Payment;
