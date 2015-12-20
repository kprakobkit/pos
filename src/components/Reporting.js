import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import ReportingNavComponent from './ReportingNav';
import ReportingPaymentsComponent from './ReportingPayments';

const ReportingNav = createFactory(ReportingNavComponent);
const ReportingPayments = createFactory(ReportingPaymentsComponent);

function mapStateToProps(state) {
  return {
    transactions: state.transactions
  };
}

class Reporting extends Component {
  constructor(props) {
    super(props);
    this.setActiveTab = this.setActiveTab.bind(this);
    this.renderActiveTab = this.renderActiveTab.bind(this);
    this.state = {
      activeTab: 'Dashboard'
    };
  }

  componentWillMount() {
    this.props.loadTransactions();
  }


  setActiveTab(tabName) {
    return () => this.setState({ activeTab: tabName });
  }

  renderActiveTab() {
    return {
      Payments: ReportingPayments({ transactions: this.props.transactions })
    }[this.state.activeTab];
  }

  render() {
    return (
      dom.div(
        null,
        ReportingNav(
          {
            activeTab: this.state.activeTab,
            setActiveTab: this.setActiveTab
          }
        ),
        this.renderActiveTab()
      )
    );
  }
}

Reporting.propTypes = {
  loadTransactions: PropTypes.func.isRequired,
  transactions: PropTypes.array
};

Reporting.defaultProps = {
  transactions: []
};

export default Reporting;
export const ReportingContainer = connect(
  mapStateToProps,
  actions
)(Reporting);
