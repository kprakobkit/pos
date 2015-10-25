import React from 'react';

const dom = React.DOM;

class Order extends React.Component {
  constructor(props) {
    super(props);
  }

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
