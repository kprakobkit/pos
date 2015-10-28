import { Component, PropTypes, DOM as dom, createFactory } from 'react';

class OrderDetails extends Component {
  render() {
    return (
      dom.div(
        null,
        dom.h1({ className: 'order-title' }, 'Order #' + this.props.params.id)
      )
    );
  }
}

export default OrderDetails;
