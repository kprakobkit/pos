import { Component, PropTypes, DOM as dom, createFactory } from 'react';

class ReportingDashboard extends Component {
  render() {
    return (
      dom.div(
        null,
        dom.h2(null, 'Dashboard')
      )
    );
  }
}

ReportingDashboard.propTypes = {
  transactions: PropTypes.array.isRequired
};

export default ReportingDashboard;
