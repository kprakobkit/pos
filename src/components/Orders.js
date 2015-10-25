import React from 'react';
import { connect } from 'react-redux';
import Order from './Order';

const dom = React.DOM;
const order = React.createFactory(Order);

function mapStateToProps(state) {
  return {
    orders: state.get('orders')
  };
}

class Orders extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      dom.div(
        null,
        dom.h1({ className: 'orders-title' }, 'Orders'),
        this.props.orders.toJS().map((orderData) => {
          return order(Object.assign(orderData, { key: orderData.id }));
        })
      )
    );
  }
}

export default Orders;
export const OrdersContainer = connect(mapStateToProps)(Orders);
