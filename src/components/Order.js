import React from 'react';

const dom = React.DOM;

class Order extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      dom.div(
        null,
        dom.div({ className: 'order-number' }, this.props.id),
        dom.div({ className: 'order-status' }, this.props.status)
      )
    );
  }
}

export default Order;
