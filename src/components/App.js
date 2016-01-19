import { Component, DOM as dom, createFactory } from 'react';
import NavComponent from './Nav';

const Nav = createFactory(NavComponent);

class App extends Component {
  render() {
    const { location } = this.props;
    return (
      dom.div(
        { className: 'container-fluid' },
        location.pathname === '/' ? null : Nav(),
        this.props.children
      )
    );
  }
}

export default App;
