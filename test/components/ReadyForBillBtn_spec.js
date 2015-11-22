import { expect, spy } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import constants from '../../src/constants';
import ReadyForBillBtnComponent from '../../src/components/ReadyForBillBtn';
import Generator from '../support/generator';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const ReadyForBillBtn = React.createFactory(ReadyForBillBtnComponent);

describe('Ready for Payment', () => {
  it('is disabled when not all entries are delivered or canceled', () => {
    const delivered = Generator.entry().status(constants.DELIVERED).build();
    const open = Generator.entry().status(constants.OPEN).build();
    const entries = [open, delivered];
    const component = renderIntoDocument(ReadyForBillBtn({ entries }));
    const btn = findRenderedDOMComponentWithClass(component, 'ready-for-bill');

    expect(btn.disabled).to.be.true;
  });

  it('is clickable when all entries are delivered or canceled', () => {
    const delivered = Generator.entry().status(constants.DELIVERED).build();
    const entries = [delivered];
    const component = renderIntoDocument(ReadyForBillBtn({ entries }));
    const btn = findRenderedDOMComponentWithClass(component, 'ready-for-bill');

    expect(btn.disabled).to.be.false;
  });

  it('is disabled when there are no entries', () => {
    const component = renderIntoDocument(ReadyForBillBtn({ entries: [] }));
    const btn = findRenderedDOMComponentWithClass(component, 'ready-for-bill');

    expect(btn.disabled).to.be.true;
  });

  it('is disabled when all entries are canceled', () => {
    const canceled = Generator.entry().status(constants.CANCELED).build();
    const entries = [canceled];
    const component = renderIntoDocument(ReadyForBillBtn({ entries }));
    const btn = findRenderedDOMComponentWithClass(component, 'ready-for-bill');

    expect(btn.disabled).to.be.true;
  });

  it('calls onClick handler', () => {
    const handleOnClick = spy();
    const delivered = Generator.entry().status(constants.DELIVERED).build();
    const component = renderIntoDocument(ReadyForBillBtn({ entries: [delivered], handleOnClick }));
    const btn = findRenderedDOMComponentWithClass(component, 'ready-for-bill');

    Simulate.click(btn);

    expect(handleOnClick).to.have.been.called();
  });
});


