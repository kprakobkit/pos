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

  handleChangeStatus(e) {
    const status = e.target.value;
    this.props.changeEntryStatus(this.props.index, status);
  }

  render() {
    return dom.tr(
      { className: 'order-entry' },
      dom.td({ className: 'entry-name' }, dom.h2(null, this.props.name)),
      dom.td({ className: 'entry-comment' }, dom.h2(null, dom.small(null, this.props.comment))),
      this.props.ofOpenOrder ?
        dom.td(
          { className: 'entry-status' },
          dom.select(
            {
              className: 'form-control input-lg',
              value: this.props.status,
              onChange: this.handleChangeStatus
            },
            dom.option({ value: constants.OPEN }, constants.OPEN),
            dom.option({ value: constants.DELIVERED }, constants.DELIVERED),
            dom.option({ value: constants.CANCELED }, constants.CANCELED)
          )
        ) :
        dom.td(
          { className: 'entry-price' },
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
