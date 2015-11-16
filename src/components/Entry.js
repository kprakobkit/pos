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
      dom.td({ className: 'entry-comment' }, dom.h3(null, this.props.comment)),
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
      )
    );
  }
}

Entry.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  comment: PropTypes.string
};

Entry.defaultProps = {
  comment: ''
};

export default Entry;
