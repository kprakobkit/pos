import React from 'react';

const dom = React.DOM;

class Winner extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      dom.div({ className: 'winner' }, 'Winner is ' + this.props.winner)
    );
  }
}

export default Winner;
