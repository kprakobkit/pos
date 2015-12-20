import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import ReportingNavComponent from './ReportingNav';

const ReportingNav = createFactory(ReportingNavComponent);

function mapStateToProps(state) {
  return {
    transactions: state.transactions
  };
}

class Reporting extends Component {
  constructor(props) {
    super(props);
    this.setActiveTab = this.setActiveTab.bind(this);
    this.state = {
      activeTab: 'Dashboard'
    };
  }

  setActiveTab(tabName) {
    return () => this.setState({ activeTab: tabName });
  }

  componentWillMount() {
    this.props.loadTransactions();
  }

  render() {
    return ReportingNav(
      {
        activeTab: this.state.activeTab,
        setActiveTab: this.setActiveTab
      }
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
