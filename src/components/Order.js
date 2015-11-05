import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { Link as LinkComponent } from 'react-router';

const Link = createFactory(LinkComponent);

class Order extends Component {
  printStatus() {
    return this.props.status.replace(/_/g, ' ').toLowerCase();
  }

  render() {
    return (
      Link(
        {
          to:        `/orders/${this.props.id}`,
          className: 'order'
        },
        dom.div(
          { className: 'row' },
          dom.div(
            { className: 'order-number col-xs-6' },
            `Order ${this.props.id}`
          ),
          dom.div(
            {
              className: 'order-status col-xs-6 text-capitalize text-center'
            },
            this.printStatus()
          )
        )
      )
    );
  }
}

Order.propTypes = {
  id:     PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};

export default Order;
