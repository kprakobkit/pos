import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import constants from '../../src/constants';
import TableNumberSelectComponent from './TableNumberSelect';
import ButtonWithConfirmationComponent from './ButtonWithConfirmation';

const TableNumberSelect = createFactory(TableNumberSelectComponent);
const ButtonWithConfirmation = createFactory(ButtonWithConfirmationComponent);

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
          dom.h4({ className: 'modal-title inline' }, 'Edit Order'),
          dom.button({
            className: 'close',
            type: 'button',
            onClick: this.props.closeModal
          }, dom.span(null, 'x'))
        ),
        dom.div(
          { className: 'modal-body' },
          this.props.status === constants.READY_FOR_BILL ? dom.p(null, dom.button(
            {
              className: 'btn btn-warning btn-block btn-sm reopen-order',
              onClick: this.props.handleReopen
            },
            'Reopen this Order'
          )) : dom.form(
          { className: 'edit-order form-horizontal' },
          dom.div(
            { className: 'form-group' },
            dom.label(null, 'Table #'),
            TableNumberSelect({
              tableNumber: this.props.tableNumber,
              handleOnChange: this.handleOnChange
            }))
          ),
          ButtonWithConfirmation({
            onConfirmation: this.props.handleRemove,
            actionText: 'Remove this order',
            confirmationText: 'Confirm delete order'
          })
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
