import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import MasterItemsComponent from './MasterItems';
import * as actions from '../action_creators';
import _ from 'underscore';

const MasterItems = createFactory(MasterItemsComponent);
const mapStateToProps = function (state) {
  return {
    masterItems: state.items
  };
};

class NewOrder extends Component {
  componentWillMount() {
    this.props.loadItems();
  }

  render() {
    return dom.div(
      null,
      MasterItems({
        masterItems: this.props.masterItems,
        handleSubmit: this.props.addOrder,
        title: 'New Order'
      }),
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
