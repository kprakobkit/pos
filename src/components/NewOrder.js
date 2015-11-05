import { Component, DOM as dom } from 'react';
import { connect } from 'react-redux';
import * as actions from '../action_creators';

const mapStateToProps = function (state) {
  return {
    items: state.items
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

  componentWillMount(event) {
    this.props.loadItems();
  }

  addOrderItem() {
    const defaultValue = this.props.items[0] && this.props.items[0].id;
    this.state.items.push(this.state.selectedItem || defaultValue);
  }

  selectItem(event) {
    this.state.selectedItem = event.target.value;
  }

  render() {
    return dom.div(
      null,
      dom.h1(null, 'New Order Page'),
      dom.select(
        { id: 'item', onChange: this.selectItem },
        this.props.items.map((item) => {
          return dom.option({ value: item.id }, item.name);
        })
      ),
      dom.button({
          className: 'btn btn-default',
          onClick: this.addOrderItem
        }, 'Add Item'),
      dom.br(),
      dom.button({
          className: 'btn btn-primary'
        }, 'Submit')
    );
  }
}

NewOrder.defaultProps = {
  items: []
};

export default NewOrder;
export const NewOrderContainer = connect(mapStateToProps, actions)(NewOrder);
