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
          this.props.status,
          this.props.status === constants.OPEN ? dom.button(
            {
              className: 'delivered',
              onClick: () => {
                this.props.changeEntryStatus(this.props.index, constants.DELIVERED);
              }
            },
            'Delivered'
          ) : dom.button(
          {
            className: 'mark-open',
            onClick: () => {
              this.props.changeEntryStatus(this.props.index, constants.OPEN);
            }
          },
          'Mark Open'
          ),
          dom.button(
            {
              className: 'canceled',
              onClick: () => {
                this.props.changeEntryStatus(this.props.index, constants.CANCELED);
              }
            },
            'Cancel'
          )
        ) :
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
