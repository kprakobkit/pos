import { Component, PropTypes, DOM as dom } from 'react';
import constants from '../../src/constants';
import _ from 'ramda';

class ReadyForBillBtn extends Component {
  shouldBeHidden() {
    const hasOpen = _.any(_.equals(constants.OPEN));
    const hasCompleted = _.any(_.equals(constants.COMPLETED));
    const hasOpenOrCompleted = _.either(hasOpen, hasCompleted);

    const allClosed = _.all(_.equals(constants.CLOSED));
    const allCanceled = _.all(_.equals(constants.CANCELED));
    const allCanceledOrClosed = _.either(allClosed, allCanceled);

    const entryStatuses = _.pluck('status', this.props.entries);
    return !this.props.overrideHidden && _.either(hasOpenOrCompleted, allCanceledOrClosed)(entryStatuses);
  }

  render() {
    return (
      dom.p(
        null,
        dom.button(
          {
            className: `order-entries ready-for-bill btn btn-primary btn-lg btn-block ${ this.shouldBeHidden() ? 'hidden' : 'show' }`,
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
  overrideHidden: PropTypes.bool,
  text: PropTypes.string
};

ReadyForBillBtn.defaultProps = {
  entries: [],
  overrideHidden: false,
  text: 'Ready for Bill'
};

export default ReadyForBillBtn;

