import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import { Link as LinkComponent } from 'react-router';
import actions from '../action_creators';
import constants from '../constants';
import moment from 'moment';
import _ from 'underscore';

const Link = createFactory(LinkComponent);
const displayMax = 6;

function mapStateToProps(state) {
  return {
    orders: state.orders
  };
}

function toOpenEntries({ id, entries }) {
  return entries.map((entry, entryIndex) => ({
    orderId: id,
    entry,
    entryIndex,
    createdAt: moment(entry.created_at)
  }));
}

class Chef extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.unselectEntry = this.unselectEntry.bind(this);
    this.state = {
      selectedEntry: undefined
    };
  }

  getOpenEntries() {
    const allEntries = this.props.orders.reduce((entries, order) => entries.concat(toOpenEntries(order)), []);
    const sortedOpengEntries = _.sortBy(allEntries.filter(({ entry }) => entry.status === constants.OPEN), 'createdAt');

    return sortedOpengEntries.slice(0, displayMax);
  }

  componentWillMount() {
    this.props.loadOrders();
  }

  handleSubmit() {
    const { orderId, entryIndex } = this.state.selectedEntry;
    this.unselectEntry();
    this.props.changeEntryStatus(orderId, entryIndex, constants.COMPLETED);
  }

  unselectEntry() {
    this.setState({ selectedEntry: undefined });
  }

  render() {
    return dom.div(
      null,
      dom.p(null, Link({ to: '/', className: 'orders-link' }, 'Home')),
      this.getOpenEntries().map(
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
        dom.button({ className: 'cancel', onClick: this.unselectEntry }, 'Cancel')
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
