import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import constants from '../constants';
import _ from 'underscore';
import EntryComponent from './Entry';
import MasterItemsComponent from './MasterItems';
import OpenOrderComponent from './OpenOrder';
import ProcessingOrderComponent from './ProcessingOrder';

const Entry = createFactory(EntryComponent);
const MasterItems = createFactory(MasterItemsComponent);
const OpenOrder = createFactory(OpenOrderComponent);
const ProcessingOrder = createFactory(ProcessingOrderComponent);

function mapStateToProps(state) {
  return {
    orders: state.orders,
    masterItems: state.items
  };
}

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: {
        entries: []
      }
    };
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

  render() {
    return (
      dom.div(
        null,
        dom.h1({ className: 'order-title' }, `Order #${this.props.params.id}`),
        dom.h2(
          { className: 'order-status' },
          `Status: ${this.state.order.status}`,
          dom.small(
            null,
            this.state.order.status === constants.READY_FOR_BILL ? dom.button({
              className: 'back-to-open btn btn-link',
              onClick: this.props.setOpen.bind(null, this.props.params.id)
            }, 'Back to "Open" Status') : null
          ),
        ),
        dom.h2({ className: 'order-table-number' }, this.state.order.tableNumber),
        this.state.order.status === constants.OPEN ?
          OpenOrder(
            {
              order: this.state.order,
              masterItems: this.props.masterItems,
              addEntriesToOrder: this.props.addEntriesToOrder.bind(null, this.props.params.id),
              changeEntryStatus: this.props.changeEntryStatus.bind(null, this.props.params.id),
              setReadyForBill: this.props.setReadyForBill.bind(null, this.props.params.id)
            }
          ) :
          ProcessingOrder(
            {
              order: this.state.order,
              setClosed: this.props.setClosed.bind(null, this.props.params.id)
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

export default OrderDetails;
export const OrderDetailsContainer = connect(
  mapStateToProps,
  actions
)(OrderDetails);
