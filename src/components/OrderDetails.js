import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import constants from '../constants';
import _ from 'underscore';
import EntryComponent from './Entry';
import MasterItemsComponent from './MasterItems';
import OpenOrderComponent from './OpenOrder';
import ProcessingOrderComponent from './ProcessingOrder';
import ModalComponent from 'react-modal';
import EditOrderComponent from './EditOrder';

const Entry = createFactory(EntryComponent);
const MasterItems = createFactory(MasterItemsComponent);
const OpenOrder = createFactory(OpenOrderComponent);
const ProcessingOrder = createFactory(ProcessingOrderComponent);
const Modal = createFactory(ModalComponent);
const EditOrder = createFactory(EditOrderComponent);

function mapStateToProps(state) {
  return {
    orders: state.orders,
    masterItems: state.items
  };
}

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.toggleForm = this.toggleForm.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleReopen = this.handleReopen.bind(this);
    this.state = {
      order: {
        entries: []
      },
      showAddEntry: false,
      modalIsOpen: false
    };
  }

  toggleForm() {
    this.setState({ showAddEntry: !this.state.showAddEntry });
  }

  componentWillMount() {
    const order = _.find(this.props.orders, { id: this.props.params.id });
    this.setState({ order });
    this.props.loadItems();
  }

  componentWillReceiveProps(props) {
    const order = _.find(props.orders, { id: this.props.params.id });
    this.setState({ order });
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  handleRemove(orderId) {
    this.props.removeOrder(orderId);
    this.closeModal();
    this.context.history && this.context.history.pushState(null, '/orders');
  }

  handleReopen(orderId) {
    this.props.setOpen(orderId);
    this.closeModal();
  }

  renderOrderInformation() {
    return (
      dom.div(
        { className: 'col-xs-8 col-sm-8' },
        dom.h3(
          { className: 'text-left order-information inline' },
          `Table ${this.state.order.tableNumber} / Order ${this.props.params.id}  `,
          dom.span({ className: 'text-info' }, `${this.state.order.status}`)
        ),
        dom.button({ onClick: this.openModal, className: 'edit-order btn btn-link' }, dom.span({ className: 'glyphicon glyphicon-chevron-down' })),
        Modal(
          {
            className: 'modal-dialog',
            isOpen: this.state.modalIsOpen,
            onRequestClose: this.closeModal,
            style: {
              content: {
                border: 0,
                background: 'none'
              }
            }
          },
          EditOrder({
            status: this.state.order.status,
            handleReopen: this.handleReopen.bind(null, this.props.params.id),
            handleRemove: this.handleRemove.bind(null, this.props.params.id),
            closeModal: this.closeModal
          })
        )
      )
    );
  }

  renderAddEntriesButton() {
    return (
      dom.div(
        { className: 'col-xs-4 col-sm-4 text-right' },
        dom.button(
          { className: `toggle-add-entry btn btn-lg btn-${ this.state.showAddEntry ? 'danger' : 'info' }`, onClick: this.toggleForm },
          this.state.showAddEntry ?
            [dom.span({
            className: 'glyphicon glyphicon-remove',
            key: 'remove',
            'aria-hidden': true
          }), '  Done Adding Items'] :
            [dom.span({
            className: 'glyphicon glyphicon-plus',
            key: 'add',
            'aria-hidden': true
          }), '  Add More Items']
        ),
      )
    );
  }

  render() {
    return (
      dom.div(
        null,
        dom.div(
          { className: 'row' },
          this.renderOrderInformation(),
          this.state.order.status === constants.OPEN ?
            this.renderAddEntriesButton() : null
        ),
        this.state.order.status === constants.OPEN ?
          OpenOrder(
            {
              order: this.state.order,
              masterItems: this.props.masterItems,
              addEntriesToOrder: this.props.addEntriesToOrder.bind(null, this.props.params.id),
              changeEntryStatus: this.props.changeEntryStatus.bind(null, this.props.params.id),
              setReadyForBill: this.props.setReadyForBill.bind(null, this.props.params.id),
              showAddEntry: this.state.showAddEntry
            }
        ) :
          ProcessingOrder(
            {
              order: this.state.order,
              setClosed: this.props.setClosed.bind(
                null,
                this.props.params.id,
                this.state.order.transaction && this.state.order.transaction.id
              ),
              setReadyForBill: this.props.setReadyForBill.bind(null, this.props.params.id)
            }
        )
      )
    );
  }
}

OrderDetails.propTypes = {
  orders: PropTypes.array.isRequired,
  masterItems: PropTypes.array.isRequired,
  loadItems: PropTypes.func.isRequired,
  addEntriesToOrder: PropTypes.func.isRequired,
  changeEntryStatus: PropTypes.func.isRequired,
  setReadyForBill: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
  setClosed: PropTypes.func.isRequired
};

OrderDetails.defaultProps = {
  orders: [],
  masterItems: []
};

OrderDetails.contextTypes = {
  history: PropTypes.object
};

export default OrderDetails;
export const OrderDetailsContainer = connect(
  mapStateToProps,
  actions
)(OrderDetails);
