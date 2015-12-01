import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import constants from '../constants';
import _ from 'underscore';
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
    this.toggleForm = this.toggleForm.bind(this);
    this.state = { showAddEntry: false };
  }

  toggleForm() {
    this.setState({ showAddEntry: !this.state.showAddEntry });
  }

  renderEntry(entry, i) {
    return entry.status !== constants.CANCELED ?
      Entry(
        _.extend({}, entry, {
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
        dom.button(
          { className: 'toggle-add-entry btn btn-info btn-lg btn-block', onClick: this.toggleForm },
          this.state.showAddEntry ? 'Close' : 'Add more items'
        ),
        dom.br(null),
        this.state.showAddEntry ? MasterItems({
          masterItems: this.props.masterItems,
          handleSubmit: this.props.addEntriesToOrder
        }) : null,
        dom.br(null),
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
