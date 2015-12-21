import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import _ from 'ramda';
import ReportingNavComponent from './ReportingNav';
import ReportingDashboardComponent from './ReportingDashboard';
import ReportingSalesComponent from './ReportingSales';
import ReportingPaymentsComponent from './ReportingPayments';

const ReportingNav = createFactory(ReportingNavComponent);
const ReportingDashboard = createFactory(ReportingDashboardComponent);
const ReportingSales = createFactory(ReportingSalesComponent);
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
      activeTab: 'Dashboard',
      tabs: {
        Dashboard: ReportingDashboard,
        Sales: ReportingSales,
        Payments: ReportingPayments
      }
    };
  }

  componentWillMount() {
    this.props.loadTransactions();
  }

  setActiveTab(tabName) {
    return () => this.setState({ activeTab: tabName });
  }

  renderActiveTab() {
    const activeTabComponent = this.state.tabs[this.state.activeTab];
    return activeTabComponent({ transactions: this.props.transactions });
  }

  render() {
    return (
      dom.div(
        null,
        ReportingNav(
          {
            activeTab: this.state.activeTab,
            tabNames: _.keys(this.state.tabs),
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
