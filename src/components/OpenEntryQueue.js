import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import constants from '../constants';
import moment from 'moment';
import _ from 'ramda';


function toOpenEntries({ id, entries, tableNumber }) {
  return entries.map((entry, entryIndex) => ({
    orderId: id,
    entry,
    tableNumber,
    entryIndex,
    createdAt: moment(entry.createdAt)
  }));
}

class OpenEntryQueue extends Component {
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
    const isOpen = _.pathEq(['entry', 'status'], constants.OPEN);
    const isFood = _.pathEq(['entry', 'type'], constants.FOOD);

    return _.pipe(
      _.chain(toOpenEntries),
      _.filter(_.allPass([isOpen, isFood])),
      _.sortBy(_.prop('createdAt')),
      _.take(this.props.displayMax)
    )(this.props.orders);
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
      dom.h3(null, `Table#: ${ openEntry.tableNumber }`),
      dom.p({ className: 'lead' }, openEntry.createdAt.fromNow()),
      dom.p({ className: 'lead' }, openEntry.entry.comment)
    );
  }

  render() {
    return dom.div(
      null,
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

OpenEntryQueue.propTypes = {
  orders: PropTypes.array.isRequired
};

OpenEntryQueue.defaultProps = {
  orders: []
};

export default OpenEntryQueue;
