import { Component, PropTypes, DOM as dom } from 'react';
import constants from '../../src/constants';

class EditOrder extends Component {
  render() {
    return (
      dom.div(
        { className: 'edit-order' },
        dom.h2({ className: 'header' }, 'Edit Order'),
        this.props.status === constants.READY_FOR_BILL ? dom.button(
          {
            className: 'btn btn-warning btn-block reopen-order',
            onClick: this.props.handleReopen
          },
          'Back to "Open" Status'
        ) : null,
        dom.button({ className: 'btn btn-primary btn-block remove-order', onClick: this.props.handleRemove }, 'Remove this order')
      )
    );
  }
}

EditOrder.propTypes = {
  handleReopen: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired
};

export default EditOrder;
