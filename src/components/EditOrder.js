import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import constants from '../../src/constants';
import TableNumberSelectComponent from './TableNumberSelect';

const TableNumberSelect = createFactory(TableNumberSelectComponent);

class EditOrder extends Component {
  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(e) {
    this.props.updateTableNumber(e.target.value);
    this.props.closeModal();
  }

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
          ) : dom.form(
          { className: 'edit-order form-horizontal' },
          dom.div(
            { className: 'form-group' },
            dom.label(null, 'Table #'),
            TableNumberSelect({
              tableNumber: this.props.tableNumber,
              handleOnChange: this.handleOnChange
            }))
          ),
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
  tableNumber: PropTypes.string.isRequired,
  updateTableNumber: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default EditOrder;
