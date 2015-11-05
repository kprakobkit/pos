import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { Link as LinkComponent } from 'react-router';

const Link = createFactory(LinkComponent);

class Order extends Component {
  printStatus() {
    return this.props.status.replace(/_/g, ' ').toLowerCase();
  }

  render() {
    return (
      dom.div(
        { className: 'order row' },
        Link(
          {
            to:        `/orders/${this.props.id}`,
            className: 'order-number col-xs-6'
          },
          `Order ${this.props.id}`
        ),
        dom.div({ className: 'order-status text-capitalize col-xs-6' }, this.printStatus())
      )
    );
  }
}

Order.propTypes = {
  id:     PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};

export default Order;
