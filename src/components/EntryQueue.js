import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import constants from '../constants';
import moment from 'moment';
import _ from 'ramda';


function toEntries({ id, entries, tableNumber }) {
  return entries.map((entry, entryIndex) => ({
    orderId: id,
    entry,
    tableNumber,
    entryIndex,
    createdAt: moment(entry.createdAt)
  }));
}

class EntryQueue extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.unselectEntry = this.unselectEntry.bind(this);
    this.renderEntry = this.renderEntry.bind(this);
    this.state = {};
  }

  getEntries() {
    const isOpen = _.pathEq(['entry', 'status'], constants.OPEN);
    const isCanceled = _.pathEq(['entry', 'status'], constants.CANCELED);
    const filterPredicates = [_.either(isCanceled, isOpen)].concat(this.props.filterPredicate);

    return _.pipe(
      _.chain(toEntries),
      _.filter(_.allPass(filterPredicates)),
      _.sortBy(_.prop('createdAt')),
      _.take(this.props.displayMax)
    )(this.props.orders);
  }

  handleSubmit(status) {
    const { orderId, entryIndex } = this.state.selectedEntry;
    this.unselectEntry();
    this.props.changeEntryStatus(orderId, entryIndex, status);
  }

  unselectEntry() {
    this.setState({ selectedEntry: undefined });
  }

  getEntryClass(entry) {
    const classes = 'entry col-sm-4 col-xs-4 list-group-item text-center';

    if(JSON.stringify(entry) === JSON.stringify(this.state.selectedEntry)) {
      return classes + ' list-group-item-success';
    } else {
      return classes;
    }
  }

  renderEntry(entry, i) {
    return dom.div(
      {
        key: i,
        className: this.getEntryClass(entry),
        onClick: () => { this.setState({ selectedEntry: entry }); }
      },
      dom.h3(null, entry.entry.name),
      dom.p(null, `Table ${ entry.tableNumber }, ${ entry.createdAt.fromNow()}`),
      entry.entry.status === constants.CANCELED ? dom.div({ className: 'label label-danger status' }, `${entry.entry.status}`) : null,
      dom.p({ className: 'comment' }, entry.entry.comment)
    );
  }

  renderConfirmation() {
    return dom.div(
      { className: 'confirmation' },
      dom.button(
        {
          className: 'submit btn btn-primary btn-lg btn-block',
          onClick: this.handleSubmit.bind(null, constants.COMPLETED)
        }, 'Mark as completed'
      ),
      dom.button(
        { className: 'cancel btn btn-danger btn-lg btn-block',
          onClick: this.unselectEntry
        },
        'Cancel'
      )
    );
  }

  renderRemoveEntry() {
    return dom.div(
      { className: 'confirm-remove' },
      dom.button({ className: 'remove-canceled-entry btn btn-danger btn-lg btn-block', onClick: this.handleSubmit.bind(null, constants.CLOSED) }, 'Remove Entry'),
    );
  }

  renderActionButtons() {
    const entryStatus = _.path(['entry', 'status'], this.state.selectedEntry);

    if(entryStatus === constants.OPEN) {
      return this.renderConfirmation();
    } else if (entryStatus === constants.CANCELED) {
      return this.renderRemoveEntry();
    }
  }

  render() {
    return dom.div(
      null,
      dom.div(
        { className: 'row entries list-group' },
        this.getEntries().map(this.renderEntry),
      ),
      this.renderActionButtons()
    );
  }
}

EntryQueue.propTypes = {
  orders: PropTypes.array.isRequired,
  filterPredicate: PropTypes.func.isRequired,
  changeEntryStatus: PropTypes.func.isRequired
};

EntryQueue.defaultProps = {
  displayMax: 6
};

export default EntryQueue;
