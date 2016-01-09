import { Component, PropTypes, DOM as dom } from 'react';
import constants from '../../src/constants';
import _ from 'ramda';

class ReadyForBillBtn extends Component {
  shouldBeDisabled() {
    const hasOpen = _.any(_.equals(constants.OPEN));
    const hasCompleted = _.any(_.equals(constants.COMPLETED));
    const hasOpenOrCompleted = _.either(hasOpen, hasCompleted);

    const allClosed = _.all(_.equals(constants.CLOSED));
    const allCanceled = _.all(_.equals(constants.CANCELED));
    const allCanceledOrClosed = _.either(allClosed, allCanceled);

    const entryStatuses = _.pluck('status', this.props.entries);
    return _.either(hasOpenOrCompleted, allCanceledOrClosed)(entryStatuses);
  }

  render() {
    return (
      dom.p(
        null,
        dom.button(
          {
            className: 'order-entries ready-for-bill btn btn-primary btn-block',
            disabled: !this.props.overrideDisable && this.shouldBeDisabled(),
            onClick: this.props.handleOnClick
          },
          this.props.text
        )
      )
    );
  }
}

ReadyForBillBtn.propTypes = {
  entries: PropTypes.array.isRequired,
  overrideDisable: PropTypes.bool,
  text: PropTypes.string
};

ReadyForBillBtn.defaultProps = {
  entries: [],
  overrideDisable: false,
  text: 'Ready for Bill'
};

export default ReadyForBillBtn;

