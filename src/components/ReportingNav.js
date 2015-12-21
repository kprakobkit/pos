import { Component, PropTypes, DOM as dom } from 'react';

class ReportingNav extends Component {
  constructor(props) {
    super(props);
    this.maybeActiveClass = this.maybeActiveClass.bind(this);
    this.renderTab = this.renderTab.bind(this);
  }

  maybeActiveClass(tabName) {
    return tabName === this.props.activeTab ? 'active' : null;
  }

  renderTab(tabName, i) {
    return dom.li(
      {
        key: i,
        className: `reporting-nav-${tabName.toLowerCase()}-tab ${this.maybeActiveClass(tabName)}`,
        onClick: this.props.setActiveTab(tabName)
      },
      dom.a({ href: '#' }, tabName)
    );
  }

  render() {
    return (
      dom.div(
        { className: 'clearfix' },
        dom.ul(
          { className: 'nav nav-tabs' },
          this.props.tabNames.map(this.renderTab)
        )
      )
    );
  }
}

ReportingNav.propTypes = {
  activeTab: PropTypes.string.isRequired,
  tabNames: PropTypes.array.isRequired,
  setActiveTab: PropTypes.func.isRequired
};

export default ReportingNav;
