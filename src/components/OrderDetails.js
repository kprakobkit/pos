import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import _ from 'underscore';
import EntryComponent from './Entry';
import MasterItemsComponent from './MasterItems';
import { Link as LinkComponent } from 'react-router';

const Entry = createFactory(EntryComponent);
const MasterItems = createFactory(MasterItemsComponent);
const Link = createFactory(LinkComponent);

function mapStateToProps(state) {
  return {
    orders: state.orders,
    masterItems: state.items
  };
}

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.renderEntry = this.renderEntry.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.state = {
      order: {
        entries: {}
      },
      showAddEntry: false
    };
  }

  componentWillMount() {
    const order = _.find(this.props.orders, { id: this.props.params.id });
    this.setState({ order });
    this.props.loadItems();
  }

  componentWillReceiveProps(props) {
    const order = _.find(props.orders, { id: this.props.params.id });
    this.setState({ order });
  }

  toggleForm() {
    this.setState({ showAddEntry: !this.state.showAddEntry });
  }

  renderEntry(entry, i) {
    return Entry(
      _.extend({}, entry, {
        key: i,
        index: i,
        changeEntryStatus: this.props.changeEntryStatus.bind(null, this.props.params.id)
      })
    );
  }

  render() {
    return (
      dom.div(
        null,
        dom.h1({ className: 'order-title' }, `Order #${this.props.params.id}`),
        dom.h2({ className: 'order-status' }, `Status: ${this.state.order.status}`),
        dom.button(
          { className: 'toggle-add-entry btn btn-link btn-lg btn-block', onClick: this.toggleForm },
          this.state.showAddEntry ? 'Close' : 'Add more items'
        ),
        this.state.showAddEntry ? MasterItems({
          masterItems: this.props.masterItems,
          handleSubmit: this.props.addEntriesToOrder.bind(null, this.props.params.id)
        }) : null,
        dom.br(null),
        dom.div(
          { className: 'order-entries' },
          dom.table(
            { className: 'table table-striped' },
            dom.tbody(
              null,
              this.state.order.entries.map(this.renderEntry)
            )
          )
        ),
        Link(
          { to: '/orders', className: 'orders-link' },
          dom.p(
            null,
            dom.button(
              { className: 'btn btn-danger btn-lg btn-block' },
              'Back'
            )
          )
        )
      )
    );
  }
}

OrderDetails.propTypes = {
  orders: PropTypes.array.isRequired,
  masterItems: PropTypes.array.isRequired
};

OrderDetails.defaultProps = {
  orders: [],
  masterItems: []
};

export default OrderDetails;
export const OrderDetailsContainer = connect(
  mapStateToProps,
  actions
)(OrderDetails);
