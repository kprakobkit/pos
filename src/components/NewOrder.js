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
    this.addEntry = this.addEntry.bind(this);
    this.addComment = this.addComment.bind(this);
    this.state = {
      items: [],
      comment: ''
    };
  }

  componentWillMount() {
    this.props.loadItems();
  }

  addEntry() {
    const selectedItem = Object.assign({}, this.state.selectedItem || this.props.masterItems[0]);
    selectedItem.comment = this.state.comment;
    const items = this.state.items.concat(selectedItem);

    this.setState({ items });
  }

  selectItem(e) {
    const itemId = e.target.value;
    const selectedItem = Object.assign({}, _.find(this.props.masterItems, (item) => item.id === itemId));

    this.setState({ selectedItem });
  }

  addComment(e) {
    const comment = e.target.value;

    this.setState({ comment });
  }

  render() {
    return dom.div(
      null,
      dom.h1(null, 'New Order'),
      dom.p(
        null,
        dom.select(
          { className: 'select-items form-control input-lg', onChange: this.selectItem },
          this.props.masterItems.map((item) => {
            return dom.option({ className: 'option', value: item.id }, item.name);
          })
        )
      ),
      dom.p(
        null,
        dom.input(
          { className: 'add-comment input-lg form-control', placeholder: 'e.g. No meat, extra sauce', onChange: this.addComment }
        )
      ),
      dom.p(
        null,
        dom.button(
          { className: 'btn btn-default add-item btn-lg btn-block', onClick: this.addEntry },
          'Add Item'
        )
      ),
      dom.div(
        null,
        dom.table(
          { className: 'table table-striped' },
          dom.tbody(
            null,
            this.state.items.map((item, i) => dom.tr(
              { className: 'added-item' },
              dom.td(null, dom.h2(null, i + 1)),
              dom.td({ className: 'entry-name' }, dom.h2(null, item.name)),
              dom.td({ className: 'entry-comment' }, dom.h3(null, item.comment))
            ))
          )
        )
      ),
      dom.button(
        { className: 'btn btn-primary submit-order btn-lg btn-block', onClick: () => { this.props.addOrder(this.state.items); } },
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
