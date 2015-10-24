import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { List, Map } from 'immutable';
import Results from '../../src/components/Results';

const { renderIntoDocument, scryRenderedDOMComponentsWithClass, Simulate } = TestUtils;
const results = React.createFactory(Results);

describe('Results', () => {
  const item1 = 'Trainspotting';
  const item2 = '28 Days Later';
  const pair = List.of(item1, item2);

  it('renders entries with vote counts or zero', () => {
    const tally = Map({ 'Trainspotting' : 5 });
    const component = renderIntoDocument(results({ pair: pair, tally: tally }));
    const entries = scryRenderedDOMComponentsWithClass(component, 'entry');
    const [train, days] = entries.map(entry => entry.textContent);

    expect(entries.length).to.equal(2);
    expect(train).to.contain(item1);
    expect(train).to.contain('5');
    expect(days).to.contain(item2);
    expect(days).to.contain('0');
  });

  it('invokes the next callback when next button is clicked', () => {
    let nextInvoked = false;
    const next = () => nextInvoked = true;
    const component = renderIntoDocument(
      results(
        {
          pair:  pair,
          tally: Map(),
          next:  next
        }
      )
    );
    Simulate.click(ReactDOM.findDOMNode(component.refs.next));

    expect(nextInvoked).to.equal(true);
  });

  it('renders the winner when there is one', () => {
    const component = renderIntoDocument(
      results(
        {
          winner: item1,
          pair:   pair,
          tally:  Map()
        }
      )
    );
    const winner = ReactDOM.findDOMNode(component.refs.winner);

    expect(winner).to.be.ok;
    expect(winner.textContent).to.contain(item1);
  });
});
