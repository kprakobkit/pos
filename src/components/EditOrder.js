import { Component, PropTypes, DOM as dom } from 'react';
import constants from '../../src/constants';

class EditOrder extends Component {
  render() {
    return (
      dom.div(
        { className: 'modal-content' },
        dom.div(
          { className: 'modal-header' },
          dom.h2({ className: 'modal-title inline' }, 'Edit Order'),
          dom.button({
            className: 'close',
            type: 'button',
            onClick: this.props.closeModal
          }, dom.span(null, 'x'))
        ),
        dom.div(
          { className: 'modal-body' },
          this.props.status === constants.READY_FOR_BILL ? dom.button(
            {
              className: 'btn btn-warning btn-lg btn-block reopen-order',
              onClick: this.props.handleReopen
            },
            'Reopen this Order'
          ) : null,
          dom.button({ className: 'btn btn-danger btn-lg btn-block remove-order', onClick: this.props.handleRemove }, 'Remove this order')
        )
      )
    );
  }
}

EditOrder.propTypes = {
  handleReopen: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  closeModal: PropTypes.func
};

export default EditOrder;
