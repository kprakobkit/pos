import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.children;
  }
}

export default App;
