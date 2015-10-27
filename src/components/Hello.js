import { Component, DOM as dom } from 'react';

class Hello extends Component {
  render() {
    return (
      dom.h1(null, 'hello there')
    );
  }
}

export default Hello;
