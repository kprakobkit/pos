import { Component, DOM as dom } from 'react';
import { connect } from 'react-redux';
import * as actions from '../action_creators';

const mapStateToProps = function (state) {
  return {
    orders: state.orders,
    items: state.items
  };
};

class NewOrder extends Component {
  render() {
    return dom.div(
      null,
      dom.h1(null, 'New Order Page'),
      dom.button({
          className: 'btn btn-default',
          onClick: this.props.addOrder
        }, 'Submit')
    );
  }
}

export default NewOrder;
export const NewOrderContainer = connect(mapStateToProps, actions)(NewOrder);
