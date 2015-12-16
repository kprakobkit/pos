import { expect, spy } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportingNavComponent from '../../src/components/ReportingNav';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;

const ReportingNav = React.createFactory(ReportingNavComponent);

function setup() {
  const activeTab = 'Dashboard';
  const setActiveTab = spy();
  const component = renderIntoDocument(ReportingNav({ activeTab, setActiveTab }));

  return {
    salesTab: findRenderedDOMComponentWithClass(component, 'reporting-nav-sales-tab'),
    setActiveTab
  };
}

describe('ReportingNav', () => {
  it('calls setActiveTab on tab select', () => {
    const { salesTab, setActiveTab } = setup();

    Simulate.click(salesTab);

    expect(setActiveTab).to.have.been.called();
  });
});


