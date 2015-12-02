import { Component, PropTypes, DOM as dom } from 'react';
import constants from '../../src/constants';
import _ from 'underscore';

class ReadyForBillBtn extends Component {
  allEntriesAreCanceled() {
    return _.all(this.props.entries, (entry) => entry.status === constants.CANCELED);
  }

  thereAreOpenEntries() {
    return _.some(this.props.entries, (entry) => entry.status === constants.OPEN);
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
            className: 'order-entries ready-for-bill btn btn-primary btn-lg btn-block',
            disabled: !this.props.overrideDisable && this.shouldBeDisabled(),
            onClick: this.props.handleOnClick
          },
          'Ready for Bill'
        )
      )
    );
  }
}

ReadyForBillBtn.propTypes = {
  entries: PropTypes.array.isRequired,
  overrideDisable: PropTypes.bool
};

ReadyForBillBtn.defaultProps = {
  entries: [],
  overrideDisable: false
};

export default ReadyForBillBtn;

