import { expect, spy } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ButtonWithConfirmationComponent from '../../src/components/ButtonWithConfirmation';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;

const ButtonWithConfirmation = React.createFactory(ButtonWithConfirmationComponent);

function setup() {
  const onConfirmation = spy();
  const actionText = 'Button Action';
  const confirmationText = 'Confirm Action';
  const component = renderIntoDocument(ButtonWithConfirmation({ onConfirmation, actionText, confirmationText }));
  const buttonAction = findRenderedDOMComponentWithClass(component, 'button-action');
  Simulate.click(buttonAction);
  const confirm = findRenderedDOMComponentWithClass(component, 'confirm');
  const back = findRenderedDOMComponentWithClass(component, 'back');

  return {
    confirm,
    back,
    onConfirmation,
    component
  };
}

describe('ButtonWithConfirmation', () => {
  it('shows confirm action and back button after clicking on button action', () => {
    const { back, confirm } = setup();

    expect(confirm.textContent).to.equal('Confirm Action');
    expect(back.textContent).to.equal('Back');
  });

  it('clicking on confirm calls onConfirmation prop ', () => {
    const { confirm, onConfirmation } = setup();

    Simulate.click(confirm);

    expect(onConfirmation).to.have.been.called();
  });

  it('clicking back shows action button', () => {
    const { component, back } = setup();
    Simulate.click(back);
    const buttonAction = findRenderedDOMComponentWithClass(component, 'button-action');

    expect(buttonAction.textContent).to.equal('Button Action');
  });
});
