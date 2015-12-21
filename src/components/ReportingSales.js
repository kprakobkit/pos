import { Component, PropTypes, DOM as dom, createFactory } from 'react';

class ReportingSales extends Component {
  render() {
    return (
      dom.div(
        null,
        dom.h2(null, 'Sales')
      )
    );
  }
}

ReportingSales.propTypes = {
  transactions: PropTypes.array.isRequired
};

export default ReportingSales;
