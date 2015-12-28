import { Component, PropTypes, DOM as dom } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import constants from '../constants';
import $ from '../money';
import _ from 'ramda';

class Entry extends Component {
  constructor(props) {
    super(props);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
  }

  handleChangeStatus(status) {
    this.props.changeEntryStatus(this.props.index, status);
  }

  showDelivered() {
    return _.contains(this.props.status, [constants.OPEN, constants.COMPLETED]);
  }

  renderActionButtons() {
    return dom.td(
      { key: 'enntry-actions', className: 'entry-actions col-md-3 col-sm-3' },
      this.showDelivered() ? dom.button(
        {
          className: 'btn btn-primary btn-block delivered',
          onClick: this.handleChangeStatus.bind(null, constants.DELIVERED)
        },
        'Mark Delivered'
      ) : null,
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
      dom.td({ className: 'entry-name' }, dom.h3(null, this.props.name)),
      dom.td({ className: 'entry-comment' }, dom.h3(null, dom.small(null, this.props.comment))),
      this.props.ofOpenOrder ? [
        dom.td({ key: 'entry-status', className: 'entry-status col-md-4 col-sm-4' }, dom.h2(null, dom.span({ className: `label label-${ this.props.status === 'COMPLETED' ? 'success' : 'primary' }` }, this.props.status))),
        this.renderActionButtons()] :
          dom.td(
            { className: 'entry-price text-right' },
            dom.h3(null, $.format(this.props.price))
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
