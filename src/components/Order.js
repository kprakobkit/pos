import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { Link as LinkComponent } from 'react-router';
import constants from '../constants';
import _ from 'ramda';

const Link = createFactory(LinkComponent);

class Order extends Component {
  render() {
    const completedEntries = _.filter(_.propEq('status', constants.COMPLETED), this.props.entries).length;

    return (
      dom.tr(
        { className: 'order text-center' },
        dom.td(
          null,
          Link(
            { to:        `/orders/${this.props.id}` },
            dom.div(
              { className: 'row' },
              dom.div(
                { className: 'table-number col-xs-2' },
                dom.h5(null, `Table# ${this.props.tableNumber}`)
              ),
              dom.div(
                { className: 'order-status col-xs-2 text-capitalize text-center' },
                dom.h5(null, this.props.printOrderStatus(this.props.status))
              ),
              dom.div(
                { className: 'completed-entries col-xs-2' },
                completedEntries > 0 ?
                  dom.h5(
                    null,
                    dom.span(
                      { className: 'label label-danger' },
                      `${ completedEntries } Completed`)
                ) : null
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
