import { Component, DOM as dom } from 'react';

class Order extends Component {
  render() {
    return (
      dom.div(
        { className: 'order' },
        dom.div({ className: 'order-number' }, this.props.id),
        dom.div({ className: 'order-status' }, this.props.status),
        dom.button(
          {
            className: 'order-status-toggle',
            onClick:   () => this.props.toggleOrder(this.props.id)
          },
          'Toggle'
        )
      )
    );
  }
}

export default Order;
