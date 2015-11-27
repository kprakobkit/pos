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
    createdAt: moment(entry.createdAt)
  }));
}

class Chef extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.unselectEntry = this.unselectEntry.bind(this);
    this.renderOpenEntry = this.renderOpenEntry.bind(this);
    this.state = {
      selectedEntry: undefined
    };
  }

  getOpenEntries() {
    const allEntries = this.props.orders.reduce((entries, order) => entries.concat(toOpenEntries(order)), []);
    const sortedOpenEntries = _.sortBy(allEntries.filter(({ entry }) => entry.status === constants.OPEN), 'createdAt');

    return sortedOpenEntries.slice(0, displayMax);
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

  getOpenEntryClass(openEntry) {
    const classes =  'open-entry col-md-4 col-sm-4 col-xs-4 list-group-item text-center';

    if(JSON.stringify(openEntry) === JSON.stringify(this.state.selectedEntry)) {
      return classes + ' list-group-item-success';
    } else {
      return classes;
    }
  }

  renderOpenEntry(openEntry, i) {
    return dom.div(
      {
        key: i,
        className: this.getOpenEntryClass(openEntry),
        onClick: () => { this.setState({ selectedEntry: openEntry }); }
      },
      dom.h2(null, openEntry.entry.name),
      dom.h3(null, `Order#: ${ openEntry.orderId }`),
      dom.p({ className: 'lead' }, openEntry.createdAt.fromNow()),
      dom.p({ className: 'lead' }, openEntry.entry.comment)
    );
  }

  render() {
    return dom.div(
      null,
      dom.p(null, Link({ to: '/', className: 'orders-link' }, 'Home')),
      dom.div(
        { className: 'row open-entries list-group' },
        this.getOpenEntries().map(this.renderOpenEntry),
      ),
      this.state.selectedEntry ? dom.div(
        { className: 'confirmation' },
        dom.button({ className: 'submit btn btn-primary btn-lg btn-block', onClick: this.handleSubmit }, 'Mark as completed'),
        dom.button({ className: 'cancel btn btn-danger btn-lg btn-block', onClick: this.unselectEntry }, 'Cancel')
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