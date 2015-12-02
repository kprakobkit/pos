import { Component, PropTypes, DOM as dom } from 'react';
import constants from '../../src/constants';
import _ from 'underscore';

class ReadyForBillBtn extends Component {
  allEntriesCanceled() {
    return _.all(this.props.entries, (entry) => entry.status === constants.CANCELED);
  }

  openOrCompletedEntries() {
    return _.some(this.props.entries, (entry) => {
      return entry.status === constants.OPEN || entry.status === constants.COMPLETED;
    });
  }

  shouldBeDisabled() {
    return this.openOrCompletedEntries() || this.allEntriesCanceled();
  }

  render() {
    return (
      dom.p(
        null,
        dom.button(
          {
            className: 'order-entries ready-for-bill btn btn-primary btn-lg btn-block',
            disabled: this.shouldBeDisabled(),
            onClick: this.props.handleOnClick
          },
          'Ready for Bill'
        )
      )
    );
  }
}

ReadyForBillBtn.propTypes = {
  entries: PropTypes.array.isRequired
};

ReadyForBillBtn.defaultProps = {
  entries: []
};

export default ReadyForBillBtn;

