import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import MasterItemsComponent from './MasterItems';
import * as actions from '../action_creators';
import _ from 'underscore';
import { Link as LinkComponent } from 'react-router';

const MasterItems = createFactory(MasterItemsComponent);
const Link = createFactory(LinkComponent);

function mapStateToProps(state) {
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
