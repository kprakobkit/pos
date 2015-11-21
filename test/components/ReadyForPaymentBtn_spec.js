import { expect, spy } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ReadyForPaymentBtnComponent from '../../src/components/ReadyForPaymentBtn';
import Generator from '../support/generator';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
  Simulate
} = TestUtils;

const ReadyForPaymentBtn = React.createFactory(ReadyForPaymentBtnComponent);

describe('Ready for Payment', () => {
  it('is disabled when not all entries are delivered or canceled', () => {
  });

  it('is clickable when all entries are delivered or canceled', () => {
  });
});


