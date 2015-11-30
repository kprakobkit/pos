import { Component, PropTypes, DOM as dom } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import constants from '../constants';
import _ from 'underscore';

class Entry extends Component {
  constructor(props) {
    super(props);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
  }

  handleChangeStatus(status) {
    this.props.changeEntryStatus(this.props.index, status);
  }

  renderActionButtons() {
    return dom.td(
      { className: 'entry-actions col-md-2' },
      this.props.status === constants.OPEN ? dom.button(
        {
          className: 'btn btn-primary btn-block delivered',
          onClick: this.handleChangeStatus.bind(null, constants.DELIVERED)
        },
        'Delivered'
      ) : dom.button(
      {
        className: 'btn btn-primary btn-block open',
        onClick: this.handleChangeStatus.bind(null, constants.OPEN)
      },
      'Reopen'
      ),
      dom.button(
        {
          className: 'btn btn-warning btn-block canceled',
          onClick: this.handleChangeStatus.bind(null, constants.CANCELED)
        },
        'Cancel'
      )
    );
  }

  render() {
    return dom.tr(
      { className: 'order-entry' },
      dom.td({ className: 'entry-name' }, dom.h2(null, this.props.name)),
      dom.td({ className: 'entry-comment' }, dom.h2(null, dom.small(null, this.props.comment))),
      this.props.ofOpenOrder ? dom.td({ className: 'entry-status col-md-2' }, dom.h2(null, dom.small(null, this.props.status))) : null,
      this.props.ofOpenOrder ?
        this.renderActionButtons() :
        dom.td(
          { className: 'entry-price text-right' },
          dom.h2(null, `$${(this.props.price / 100).toFixed(2)}`)
        )
    );
  }
}

Entry.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  comment: PropTypes.string,
  price: PropTypes.number,
  ofOpenOrder: PropTypes.bool.isRequired,
  changeEntryStatus: PropTypes.func
};

Entry.defaultProps = {
  comment: '',
  ofOpenOrder: true
};

export default Entry;
