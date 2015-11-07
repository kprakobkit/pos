import { Component, DOM as dom } from 'react';
import { connect } from 'react-redux';
import * as actions from '../action_creators';
import _ from 'underscore';

const mapStateToProps = function (state) {
  return {
    masterItems: state.items
  };
};

class NewOrder extends Component {
  constructor(props) {
    super(props);
    this.selectItem = this.selectItem.bind(this);
    this.addOrderItem = this.addOrderItem.bind(this);
    this.state = {
      items: []
    };
  }

  componentWillMount() {
    this.props.loadItems();
  }

  addOrderItem() {
    const defaultValue = this.props.masterItems[0];
    const items = this.state.items.concat(this.state.selectedItem || defaultValue);

    this.setState({ items });
  }

  selectItem(e) {
    const itemId = e.target.value;
    const selectedItem = _.find(this.props.masterItems, (item) => item.id === itemId);

    this.setState({ selectedItem });
  }

  render() {
    return dom.div(
      null,
      dom.h1(null, 'New Order Page'),
      dom.select(
        { className: 'select-items', onChange: this.selectItem },
        this.props.masterItems.map((item) => {
          return dom.option({ className: 'option', value: item.id }, item.name);
        })
      ),
      dom.button(
        {
          className: 'btn btn-default add-item',
          onClick: this.addOrderItem
        },
        'Add Item'
      ),
      dom.div(
        null,
        dom.ul(
          null,
          this.state.items.map((item) => dom.li({ className: 'added-item' }, item.name))
        )
      ),
      dom.button(
        { className: 'btn btn-primary submit-order', onClick: () => { this.props.addOrder(this.state.items); } },
        'Submit'
      )
    );
  }
}

NewOrder.defaultProps = {
  masterItems: []
};

export default NewOrder;
export const NewOrderContainer = connect(mapStateToProps, actions)(NewOrder);
