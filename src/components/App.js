import { Component, DOM as dom, createFactory } from 'react';
import NavComponent from './Nav';

const Nav = createFactory(NavComponent);

class App extends Component {
  render() {
    return (
      dom.div(
        { className: 'container-fluid' },
        Nav(),
        this.props.children
      )
    );
  }
}

export default App;
