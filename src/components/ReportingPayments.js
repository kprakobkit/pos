import { Component, PropTypes, DOM as dom, createFactory } from 'react';

class ReportingPayments extends Component {
  render() {
    return (
      dom.div(
        null,
        dom.h2(null, 'Payments')
      )
    );
  }
}

ReportingPayments.propTypes = {
  transactions: PropTypes.array.isRequired
};

export default ReportingPayments;
