import { Component, PropTypes, DOM as dom } from 'react';
import constants from '../../src/constants';
import _ from 'underscore';

class ReadyForPaymentBtn extends Component {
  allEntriesAreCanceled() {
    return _.all(this.props.entries, (entry) => (entry.status === constants.CANCELED));
  }

  thereAreOpenEntries() {
    return _.some(this.props.entries, (entry) => (entry.status === constants.OPEN));
  }

  shouldBeDisabled() {
    return this.thereAreOpenEntries() || this.allEntriesAreCanceled();
  }

  render() {
    return (
      dom.p(
        null,
        dom.button(
          {
            className: 'order-entries ready-for-payment btn btn-primary btn-lg btn-block',
            disabled: this.shouldBeDisabled() ? true : false
          },
          'Ready for Payment'
        )
      )
    );
  }
}

ReadyForPaymentBtn.propTypes = {
  entries: PropTypes.array.isRequired
};

ReadyForPaymentBtn.defaultProps = {
  entries: []
};

export default ReadyForPaymentBtn;

