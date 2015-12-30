import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import constants from '../constants';
import _ from 'ramda';
import EntryComponent from './Entry';
import MasterItemsComponent from './MasterItems';
import ReadyForBillBtnComponent from './ReadyForBillBtn';
import { Link as LinkComponent } from 'react-router';

const Entry = createFactory(EntryComponent);
const MasterItems = createFactory(MasterItemsComponent);
const ReadyForBillBtn = createFactory(ReadyForBillBtnComponent);
const Link = createFactory(LinkComponent);

class OpenOrder extends Component {
  constructor(props) {
    super(props);
    this.renderEntry = this.renderEntry.bind(this);
  }


  renderEntry(entry, i) {
    return !_.contains(entry.status, [constants.CLOSED, constants.CANCELED]) ?
      Entry(
        _.merge(entry, {
          key: i,
          index: i,
          changeEntryStatus: this.props.changeEntryStatus
        })
      ) :
      null;
  }

  render() {
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
          { className: 'order-entries' },
          dom.table(
            { className: 'table table-striped' },
            dom.tbody(
              null,
              this.props.order.entries.map(this.renderEntry)
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
            { className: 'btn btn-danger btn-lg btn-block' },
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
