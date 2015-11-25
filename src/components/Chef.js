import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import { Link as LinkComponent } from 'react-router';
import actions from '../action_creators';
import constants from '../constants';

const Link = createFactory(LinkComponent);
const displayMax = 6;

function mapStateToProps(state) {
  return {
    orders: state.orders
  };
}

function toOpenEntries(orderId, entry, entryIndex) {
  return {
    orderId,
    entry,
    entryIndex
  };
}

class Chef extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.state = {
      openEntries: [],
      selectedEntry: undefined
    };
  }

  setOpenEntries(orders) {
    const allEntries = orders.reduce((entries, order) => entries.concat(order.entries.map(toOpenEntries.bind(null, order.id))), []);
    const openEntries = allEntries.filter(({ entry }) => entry.status === constants.OPEN).slice(0, displayMax);
    this.setState({ openEntries });
  }

  componentWillMount() {
    this.props.loadOrders();
    this.setOpenEntries(this.props.orders);
  }

  componentWillReceiveProps(props) {
    this.setOpenEntries(props.orders);
  }

  handleSubmit() {
    const { orderId, entryIndex } = this.state.selectedEntry;
    this.setState({ selectedEntry: undefined });
    this.props.changeEntryStatus(orderId, entryIndex, constants.COMPLETED);
  }

  cancel() {
    this.setState({ selectedEntry: undefined });
  }

  render() {
    return dom.div(
      null,
      dom.p(null, Link({ to: '/', className: 'orders-link' }, 'Home')),
      this.state.openEntries.map(
        (openEntry, i) => dom.div(
          {
            key: i,
            className: 'open-entry',
            onClick: () => { this.setState({ selectedEntry: openEntry }); }
          },
          openEntry.entry.name
        )
      ),
      this.state.selectedEntry ? dom.div(
        { className: 'confirmation' },
        dom.p({ className: 'confirmation-text' }, 'Are you sure?'),
        dom.button({ className: 'submit', onClick: this.handleSubmit }, 'Mark as completed'),
        dom.button({ className: 'cancel', onClick: this.cancel }, 'Cancel')
      ) : null
    );
  }
}

Chef.propTypes = {
  orders: PropTypes.array.isRequired
};

Chef.defaultProps = {
  orders: []
};

export default Chef;
export const ChefContainer = connect(
  mapStateToProps,
  actions
)(Chef);
