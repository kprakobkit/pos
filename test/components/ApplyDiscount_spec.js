import { expect, spy } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import Generator from '../support/generator';
import ApplyDiscountComponent from '../../src/components/ApplyDiscount';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const ApplyDiscount = React.createFactory(ApplyDiscountComponent);

function setup() {
  const masterDiscounts = [Generator.discount().build(), Generator.discount()._id('discount').build()];
  const closeModal = spy();
  const saveDiscounts = spy();
  const appliedDiscounts = [Generator.discount()._id('discount').build()];
  const props = {
    masterDiscounts,
    closeModal,
    saveDiscounts,
    appliedDiscounts
  };

  const component = renderIntoDocument(ApplyDiscount(props));
  const saveDiscountsBtn = findRenderedDOMComponentWithClass(component, 'save-discounts');

  return {
    component,
    saveDiscountsBtn,
    saveDiscounts
  };
}

describe('ApplyDiscount', () => {
  it('renders all discounts', () => {
    const { component } = setup();
    const discounts = scryRenderedDOMComponentsWithClass(component, 'discount');

    expect(discounts.length).to.equal(2);
  });

  it('highlights discounts that have been applied', () => {
    const { component } = setup();
    const [_, appliedDiscount] = scryRenderedDOMComponentsWithClass(component, 'discount');

    expect(appliedDiscount.className).to.contain('success');
  });

  it('highlights discounts', () => {
    const { component } = setup();
    const [unapplied] = scryRenderedDOMComponentsWithClass(component, 'discount');
    Simulate.click(unapplied);

    expect(unapplied.className).to.contain('success');
  });

  it('unhighlights discounts', () => {
    const { component } = setup();
    const [_, appliedDiscounts] = scryRenderedDOMComponentsWithClass(component, 'discount');
    Simulate.click(appliedDiscounts);

    expect(appliedDiscounts.className).to.not.contain('success');
  });

  it('calls saveDiscount handler with selected discounts', () => {
    const { component, saveDiscountsBtn, saveDiscounts } = setup();
    const [unapplied] = scryRenderedDOMComponentsWithClass(component, 'discount');
    Simulate.click(unapplied);
    Simulate.click(saveDiscountsBtn);

    expect(saveDiscounts).to.be.called.with(component.state.discounts);
  });
});
