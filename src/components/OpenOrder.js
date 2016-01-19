import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import constants from '../constants';
import _ from 'ramda';
import EntryComponent from './Entry';
import MasterItemsComponent from './MasterItems';
import ReadyForBillBtnComponent from './ReadyForBillBtn';
import { Link as LinkComponent } from 'react-router';
import FilterComponent from './Filter';

const Entry = createFactory(EntryComponent);
const MasterItems = createFactory(MasterItemsComponent);
const ReadyForBillBtn = createFactory(ReadyForBillBtnComponent);
const Link = createFactory(LinkComponent);
const Filter = createFactory(FilterComponent);
const openAndCompleted = `${ constants.OPEN }/${ constants.COMPLETED }`;

class OpenOrder extends Component {
  constructor(props) {
    super(props);
    this.renderEntry = this.renderEntry.bind(this);
    this.filterOrders = this.filterOrders.bind(this);
    this.state = { filter: constants.ALL };
  }

  filterOrders(filter) {
    this.setState({ filter });
  }

  getFilteredEntries() {
    const entries = this.props.order.entries.filter(entry => entry.status != constants.CANCELED && entry.status != constants.CLOSED);

    if(this.state.filter === constants.ALL) {
      return entries;
    } else {
      return entries.filter(entry => entry.type === this.state.filter);
    }
  }

  renderEntry(entry) {
    const entryIndex = this.props.order.entries.indexOf(entry);

    return Entry(_.merge(entry, {
      key: entryIndex,
      index: entryIndex,
      changeEntryStatus: this.props.changeEntryStatus
    }));
  }

  printOrderStatus(status) {
    return status.replace(/_/g, ' ').toLowerCase();
  }

  render() {
    const filteredEntries = this.getFilteredEntries();
    const { filter } = this.state;

    return (
      dom.div(
        null,
        dom.div(
          { className: 'text-right' },
        ),
        this.props.showAddEntry ? MasterItems({
          masterItems: this.props.masterItems,
          handleSubmit: this.props.addEntriesToOrder
        }) : null,
        dom.div(
          { className: 'row' },
          dom.div(
            { className: 'col-xs-6' },
            Filter(
              {
                filter,
                filters: [constants.ALL, constants.FOOD, constants.DRINK],
                applyFilter: this.filterOrders,
                printFilterName: this.printOrderStatus
              }
            ),
          )
        ),
        dom.div(
          { className: 'order-entries' },
          dom.table(
            { className: 'table table-striped table-condensed' },
            dom.tbody(
              null,
              filteredEntries.length ?
                filteredEntries.map(this.renderEntry) : dom.tr(
                  { className: 'no-entries-message lead text-center' },
                  dom.td(
                    null,
                    `There are no ${ filter === 'ALL' ? '' : filter } entries.`
                  )
              )
            )
          )
        ),
        ReadyForBillBtn({
          entries: this.props.order.entries,
          handleOnClick: this.props.setReadyForBill
        }),
        Link(
          { to: '/orders', className: 'orders-link' },
          dom.button(
            { className: 'btn btn-danger btn-block' },
            'Back'
          )
        )
      )
    );
  }
}

OpenOrder.propTypes = {
  order: PropTypes.object.isRequired,
  masterItems: PropTypes.array.isRequired,
  addEntriesToOrder: PropTypes.func.isRequired,
  changeEntryStatus: PropTypes.func.isRequired,
  setReadyForBill: PropTypes.func.isRequired
};

OpenOrder.defaultProps = {
  masterItems: []
};

export default OpenOrder;
