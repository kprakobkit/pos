import React from 'react';
import Vote from './Vote';
import Winner from './Winner';

const dom = React.DOM;
const vote = React.createFactory(Vote);
const winner = React.createFactory(Winner);

class Voting extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.winner ?
        winner({ ref: 'winner', winner: this.props.winner }) :
        vote(this.props)
    );
  }
}

export default Voting;
