import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import MasterItemsComponent from './MasterItems';
import * as actions from '../action_creators';
import _ from 'underscore';
import { Link as LinkComponent } from 'react-router';

const MasterItems = createFactory(MasterItemsComponent);
const Link = createFactory(LinkComponent);
const tableNumbers = _.range(1, 31).concat('TOGO');

function mapStateToProps(state) {
  return {
    masterItems: state.items
  };
};

class NewOrder extends Component {
  componentWillMount() {
    this.setTableNumber = this.setTableNumber.bind(this);
    this.state = {
      tableNumber: 1
    };
  }

  setTableNumber(e) {
    const value = e.target.value;
    this.setState({ tableNumber: value });
  }

  render() {
    return dom.div(
      null,
      dom.h4({ className: 'title' }, 'New Order'),
      dom.div(
        { className: 'form-group' },
        dom.label(null, 'Table #'),
        dom.select(
          { className: 'table-numbers input-lg form-control', value: this.state.tableNumber, onChange: this.setTableNumber },
          tableNumbers.map((num) => dom.option({ key: num, className: 'table-number', value: num }, num))
        )
      ),
      MasterItems({
        masterItems: this.props.masterItems,
        handleSubmit: this.props.addOrder.bind(null, this.state.tableNumber)
      }),
      Link(
        { to: '/orders', className: 'orders-link' },
        dom.p(
          null,
          dom.button(
            { className: 'btn btn-danger btn-lg btn-block' },
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

export default NewOrder;
export const NewOrderContainer = connect(mapStateToProps, actions)(NewOrder);
