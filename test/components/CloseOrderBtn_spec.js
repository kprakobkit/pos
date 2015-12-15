import { expect, spy } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import CloseOrderBtnComponent from '../../src/components/CloseOrderBtn';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  Simulate
} = TestUtils;

const CloseOrderBtn = React.createFactory(CloseOrderBtnComponent);

function setup({ shouldBeDisabled = false, text } = {}) {
  const handleClick = spy();
  const component = renderIntoDocument(CloseOrderBtn({ shouldBeDisabled, handleClick, text }));

  return {
    component,
    button: findRenderedDOMComponentWithClass(component, 'close-order'),
    handleClick
  };
}

describe('CloseOrderBtn', () => {
  it('is disabled if shouldBeDisabled is true', () => {
    const { button } = setup({ shouldBeDisabled: true });

    expect(button.disabled).to.be.true;
  });

  it('is clickable if shouldBeDisabled is false', () => {
    const { button } = setup({ shouldBeDisabled: false });

    expect(button.disabled).to.be.false;
  });

  it('calls onClick handler', () => {
    const { handleClick, button } = setup({ shouldBeDisabled: false });

    Simulate.click(button);

    expect(handleClick).to.have.been.called();
  });

  it('displays received text prop', () => {
    const text = 'Some Text';
    const { button } = setup({ text });

    expect(button.textContent).to.equal(text);
  });
});
