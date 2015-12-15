import { expect, spy } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportingComponent from '../../src/components/Reporting';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;

const Reporting = React.createFactory(ReportingComponent);

function setup() {
  const loadOrders = () => {};
  const component = renderIntoDocument(Reporting({ loadOrders }));

  return {
    salesTab: findRenderedDOMComponentWithClass(component, 'reporting-nav-sales-tab'),
    component
  };
}

describe('Reporting', () => {
  it('sets active tab on tab select', () => {
    const { salesTab, component } = setup();

    Simulate.click(salesTab);

    expect(component.state.activeTab).to.equal('Sales');
  });
});
