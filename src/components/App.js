import React from 'react';
import { List, Map } from 'immutable';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.cloneElement(this.props.children, null);
  }
}

export default App;
