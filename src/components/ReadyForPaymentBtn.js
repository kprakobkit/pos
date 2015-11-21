import { Component, PropTypes, DOM as dom } from 'react';
import constants from '../../src/constants';
import _ from 'underscore';

class ReadyForPaymentBtn extends Component {
  allEntriesDeliveredOrCanceled() {
    return !(_.some(this.props.entries, (entry) => (entry.status === constants.OPEN)));
  }

  render() {
    return (
      dom.p(
        null,
        dom.button(
          {
            className: 'order-entries ready-for-payment',
            disabled: this.allEntriesDeliveredOrCanceled() ? false : true
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

