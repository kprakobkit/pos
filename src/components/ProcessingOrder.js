import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import constants from '../constants';
import _ from 'underscore';
import EntryComponent from './Entry';

const Entry = createFactory(EntryComponent);

class ProcessingOrder extends Component {
  constructor(props) {
    super(props);
    this.renderEntry = this.renderEntry.bind(this);
  }

  renderEntry(entry, i) {
    return entry.status !== constants.CANCELED ?
      Entry(
        _.extend({}, entry, {
          key: i,
          index: i,
          ofOpenOrder: false
        })
      ) :
      null;
  }

  render() {
    return (
      dom.div(
        { className: 'order-entries' },
        dom.table(
          { className: 'table table-striped' },
          dom.tbody(
            null,
            this.props.order.entries.map(this.renderEntry)
          )
        )
      )
    );
  }
}

ProcessingOrder.propTypes = {
  order: PropTypes.object.isRequired
};

export default ProcessingOrder;
