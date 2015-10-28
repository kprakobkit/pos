import { Component, DOM as dom } from 'react';
import { connect } from 'react-redux';
import * as actions from '../action_creators';

const mapStateToProps = function(state) { return {
    orders: state.orders
  }
}

class NewOrder extends Component {
  render() {
    return dom.div(
      {className: 'container'},
      dom.h1(null, 'New Order Page'),
      dom.input({placeholder: "Item name"}),
      dom.button({
          className: "btn btn-default",
          onClick: () => {
            this.props.addOrder({
              id: "foo",
              status: "open"
            })
          }
        }, 'Submit')
    )
  }
}

export default NewOrder;
export const NewOrderContainer = connect(mapStateToProps, actions)(NewOrder);
