import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.cloneElement(this.props.children, null);
  }
}

export default App;
