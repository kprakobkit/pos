import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { Link as LinkComponent } from 'react-router';

const Link = createFactory(LinkComponent);

class Order extends Component {
  render() {
    return (
      dom.tr(
        { className: 'order' },
        dom.td(
          null,
          Link(
            { to:        `/orders/${this.props.id}` },
            dom.div(
              { className: 'row' },
              dom.div(
                { className: 'table-number col-xs-6' },
                dom.h3(null, `Table# ${this.props.tableNumber}`)
              ),
              dom.div(
                {
                  className: 'order-status col-xs-6 text-capitalize text-center'
                },
                dom.h3(null, this.props.printOrderStatus(this.props.status))
              )
            )
          )
        )
      )
    );
  }
}

Order.propTypes = {
  tableNumber:     PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};

export default Order;
