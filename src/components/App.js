import React from 'react';
import { List, Map } from 'immutable';

const order1 = { id: 1, status: 'open' };
const order2 = { id: 2, status: 'closed' };
const orders = [order1, order2];

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.cloneElement(this.props.children, { orders: orders });
  }
}

export default App;
