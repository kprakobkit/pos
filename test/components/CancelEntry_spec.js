import { expect, spy } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import CancelEntryComponent from '../../src/components/CancelEntry';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;

const CancelEntry = React.createFactory(CancelEntryComponent);

function setup() {
  const onCancel = spy();
  const component = renderIntoDocument(CancelEntry({ onCancel }));
  const cancelEntry = findRenderedDOMComponentWithClass(component, 'cancel-entry');
  Simulate.click(cancelEntry);
  const confirmCancel = findRenderedDOMComponentWithClass(component, 'confirm-cancel');
  const back = findRenderedDOMComponentWithClass(component, 'back');

  return {
    confirmCancel,
    back,
    onCancel,
    component
  };
}

describe('CancelEntry', () => {
  it('shows confirm cancel and back button after clicking on cancel entry', () => {
    const { back, confirmCancel } = setup();

    expect(confirmCancel.textContent).to.equal('Confirm Cancel Entry');
    expect(back.textContent).to.equal('Back');
  });

  it('clicking on confirm cancel calls onCancel prop ', () => {
    const { confirmCancel, onCancel } = setup();

    Simulate.click(confirmCancel);

    expect(onCancel).to.have.been.called();
  });

  it('clicking back brings show cancel entry button', () => {
    const { component, back } = setup();
    Simulate.click(back);
    const cancelEntry = findRenderedDOMComponentWithClass(component, 'cancel-entry');

    expect(cancelEntry.textContent).to.equal('Cancel Entry');
  });
});
