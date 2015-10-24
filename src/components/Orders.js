import React from 'react';
import Order from './Order';

const dom = React.DOM;
const order = React.createFactory(Order);

class Orders extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      dom.div(
        null,
        dom.h1(null, 'Orders'),
        this.props.orders.map(orderData => {
          return order(Object.assign(orderData, { key: orderData.id }));
        })
      )
    );
  }
}

export default Orders;
