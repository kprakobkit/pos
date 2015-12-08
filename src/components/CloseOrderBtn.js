import { Component, PropTypes, DOM as dom } from 'react';
import constants from '../../src/constants';

class CloseOrderBtn extends Component {
  render() {
    return (
      dom.p(
        null,
        dom.button(
          {
            className: 'order-entries close-order btn btn-primary btn-lg btn-block',
            disabled: this.props.shouldBeDisabled,
            onClick: this.props.handleClick
          },
          'Close Order'
        )
      )
    );
  }
}

CloseOrderBtn.propTypes = {
  shouldBeDisabled: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default CloseOrderBtn;

