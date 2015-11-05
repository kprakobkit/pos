import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { Link as LinkComponent } from 'react-router';

const Link = createFactory(LinkComponent);

class Order extends Component {
  render() {
    return (
      dom.div(
        { className: 'order' },
        Link(
          {
            to:        `/orders/${this.props.id}`,
            className: 'order-number'
          },
          `Order ${this.props.id}`
        ),
        dom.div({ className: 'order-status' }, `Status: ${this.props.status}`)
      )
    );
  }
}

Order.propTypes = {
  id:     PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};

export default Order;
