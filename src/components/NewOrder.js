import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import MasterItemsComponent from './MasterItems';
import * as actions from '../action_creators';
import _ from 'underscore';
import { Link as LinkComponent } from 'react-router';
import TableNumberSelectComponent from './TableNumberSelect';

const MasterItems = createFactory(MasterItemsComponent);
const Link = createFactory(LinkComponent);
const TableNumberSelect = createFactory(TableNumberSelectComponent);

function mapStateToProps(state) {
  return {
    masterItems: state.items
  };
};

class NewOrder extends Component {
  constructor(props) {
    super(props);
    this.setTableNumber = this.setTableNumber.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      tableNumber: '1'
    };
  }

  setTableNumber(e) {
    const value = e.target.value;
    this.setState({ tableNumber: value });
  }

  handleSubmit(entries) {
    this.props.addOrder(this.state.tableNumber, entries, (orderId) => {
      this.context.history.pushState(null, `/orders/${orderId}`);
    });
  }

  render() {
    return dom.div(
      null,
      dom.div(
        { className: 'form-group' },
        dom.label(null, 'Table #'),
        TableNumberSelect({ handleOnChange: this.setTableNumber, tableNumber: this.state.tableNumber })
      ),
      MasterItems({
        masterItems: this.props.masterItems,
        handleSubmit: this.handleSubmit
      }),
      Link(
        { to: '/orders', className: 'orders-link' },
        dom.p(
          null,
          dom.button(
            { className: 'btn btn-danger btn-block' },
            'Back'
          )
        )
      )
    );
  }
}

NewOrder.propTypes = {
  masterItems: PropTypes.array.isRequired
};

NewOrder.defaultProps = {
  masterItems: []
};

NewOrder.contextTypes = {
  history: PropTypes.object
};

export default NewOrder;
export const NewOrderContainer = connect(mapStateToProps, actions)(NewOrder);
