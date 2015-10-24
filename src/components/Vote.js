import React from 'react';

const dom = React.DOM;

class Vote extends React.Component {
  constructor(props) {
    super(props);
  }

  getPair() {
    return this.props.pair || [];
  }

  isDisabled() {
    return !!this.props.hasVoted;
  }

  hasVotedFor(entry) {
    return this.props.hasVoted === entry;
  }

  render() {
    return (
      dom.div(
        { className: 'voting' },
        this.getPair().map(entry => {
          return dom.button(
            {
              key:      entry,
              disabled: this.isDisabled(),
              onClick:  () => this.props.vote(entry)
            },
            dom.h1(null, entry),
            this.hasVotedFor(entry) ? dom.div({ className: 'label' }, 'Voted') : null
          );
        })
      )
    );
  }
}

export default Vote;
