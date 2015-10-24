import React from 'react';

const dom = React.DOM;

class Hello extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      dom.h1(null, 'hello there')
    );
  }
}

export default Hello;
