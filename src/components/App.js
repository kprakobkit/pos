import { Component, DOM as dom } from 'react';

class App extends Component {
  render() {
    return (
      dom.div(
        { className: 'container' },
        this.props.children
      )
    );
  }
}

export default App;
