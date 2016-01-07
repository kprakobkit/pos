import { expect, spy } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import EditOrderComponent from '../../src/components/EditOrder';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;

const EditOrder = React.createFactory(EditOrderComponent);

function setup({ status }) {
  const handleReopen = spy();
  const handleRemove = spy();
  const props = {
    status,
    tableNumber: '1',
    handleReopen,
    handleRemove
  };

  const component = renderIntoDocument(EditOrder(props));

  return {
    component,
    handleReopen,
    handleRemove
  };
}

describe('EditOrder', () => {
  it('shows reopen button when an order is READY FOR BILL', () => {
    const { component } = setup({ status: constants.READY_FOR_BILL });
    const reopen = findRenderedDOMComponentWithClass(component, 'reopen-order');
  });

  it('calls reopen handler', () => {
    const { component, handleReopen } = setup({ status: constants.READY_FOR_BILL });
    const reopen = findRenderedDOMComponentWithClass(component, 'reopen-order');

    Simulate.click(reopen);

    expect(handleReopen).to.have.been.called();
  });

  it('calls remove handler', () => {
    const { component, handleRemove } = setup({ status: constants.READY_FOR_BILL });
    const remove = findRenderedDOMComponentWithClass(component, 'remove-order');

    Simulate.click(remove);

    expect(handleRemove).to.have.been.called();
  });
});
