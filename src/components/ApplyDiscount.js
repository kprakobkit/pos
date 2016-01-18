import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import constants from '../../src/constants';

class ApplyDiscount extends Component {
  render() {
    return (
      dom.div(
        { className: 'modal-content' },
        dom.div(
          { className: 'modal-header' },
          dom.h4({ className: 'modal-title inline' }, 'Discount'),
          dom.button({
            className: 'close',
            type: 'button',
            onClick: this.props.closeModal
          }, dom.span(null, 'x'))
        ),
        dom.div(
          { className: 'modal-body' },
          'Modal body'
        )
      )
    );
  }
}

ApplyDiscount.propTypes = {
  closeModal: PropTypes.func.isRequired
};

export default ApplyDiscount;
