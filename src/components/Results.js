import React from 'react';
import Winner from './Winner';

const dom = React.DOM;
const winner = React.createFactory(Winner);

class Results extends React.Component {
  constructor(props) {
    super(props);
  }

  getPair() {
    return this.props.pair || [];
  }

  getVotes(entry) {
    if (this.props.tally && this.props.tally.has(entry)) {
      return this.props.tally.get(entry);
    }
    return 0;
  }

  render() {
    return (
      this.props.winner ?
        winner({ ref: 'winner', winner: this.props.winner }) :
        dom.div(
          { className: 'results' },
          dom.div(
            { className: 'tally' },
            this.getPair().map(entry => {
              return dom.div(
                { key: entry, className: 'entry' },
                dom.h1(null, entry),
                dom.div({ className: 'vote-count' }, this.getVotes(entry))
              )
            })
          ),
          dom.div(
            { className: 'management' },
            dom.button(
              {
                ref:       'next',
                className: 'next',
                onClick:   this.props.next
              },
              'Next'
            )
          )
        )
    );
  }
}

export default Results;
