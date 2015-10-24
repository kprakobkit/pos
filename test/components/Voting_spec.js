import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { List } from 'immutable';
import Voting from '../../src/components/Voting';

const { renderIntoDocument, scryRenderedDOMComponentsWithTag, Simulate } = TestUtils;
const voting = React.createFactory(Voting);

describe('Voting', () => {
  const item1 = 'Trainspotting';
  const item2 = '28 Days Later';
  const pair = [item1, item2];

  it('renders a pair of buttons', () => {
    const component = renderIntoDocument(voting({ pair: pair }));
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(buttons.length).to.equal(2);
    expect(buttons[0].textContent).to.equal(item1);
    expect(buttons[1].textContent).to.equal(item2);
  });

  it('invokes callback when a button is clicked', () => {
    let votedWith;
    const vote = (entry) => votedWith = entry;
    const component = renderIntoDocument(voting({ pair: pair, vote: vote }));
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');
    Simulate.click(buttons[0]);

    expect(votedWith).to.equal(item1);
  });

  it('disables buttons when user has voted', () => {
    const component = renderIntoDocument(voting({ pair: pair, hasVoted: item1 }));
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(buttons.length).to.equal(2);
    expect(buttons[0].hasAttribute('disabled')).to.equal(true);
    expect(buttons[1].hasAttribute('disabled')).to.equal(true);
  });

  it('adds label to the voted entry', () => {
    const component = renderIntoDocument(voting({ pair: pair, hasVoted: item1 }));
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(buttons[0].textContent).to.contain('Voted');
  });

  it('renders just the winner when there is one', () => {
    const component = renderIntoDocument(voting({ winner: item1 }));
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(buttons.length).to.equal(0);

    const winner = ReactDOM.findDOMNode(component.refs.winner);

    expect(winner).to.be.ok;
    expect(winner.textContent).to.contain(item1);
  });

  it('does update DOM when prop changes', () => {
    const oldPair = List.of(item1, item2);
    let component = renderIntoDocument(voting({ pair: pair }));
    let firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];

    expect(firstButton.textContent).to.equal(item1);

    const newItem = 'Sunshine';
    const newPair = oldPair.set(0, newItem);
    component = renderIntoDocument(voting({ pair: newPair }));
    firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];

    expect(firstButton.textContent).to.equal(newItem);
  });
});
