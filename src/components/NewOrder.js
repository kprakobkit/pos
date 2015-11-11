import { Component, PropTypes, DOM as dom } from 'react';
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
      entries: [],
      comment: ''
    };
  }

  componentWillMount() {
    this.props.loadItems();
  }

  addEntry() {
    const selectedItem = _.extend({}, this.state.selectedItem || this.props.masterItems[0]);
    selectedItem.comment = this.state.comment;
    const entries = this.state.entries.concat(selectedItem);

    this.setState({ entries, comment: '' });
  }

  selectItem(e) {
    const itemId = e.target.value;
    const selectedItem = _.extend({}, _.find(this.props.masterItems, (item) => item.id === itemId));

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
          this.props.masterItems.map((item, i) => {
            return dom.option({ className: 'option', value: item.id, key: i + 1 }, item.name);
          })
        )
      ),
      dom.p(
        null,
        dom.input(
          {
            className: 'add-comment input-lg form-control',
            value: this.state.comment,
            placeholder: 'e.g. No meat, extra sauce',
            onChange: this.addComment
          }
        )
      ),
      dom.p(
        null,
        dom.button(
          { className: 'btn btn-default add-entry btn-lg btn-block', onClick: this.addEntry },
          'Add Item'
        )
      ),
      dom.div(
        null,
        dom.table(
          { className: 'table table-striped' },
          dom.tbody(
            null,
            this.state.entries.map((entry, i) => dom.tr(
              { className: 'entries', key: i + 1 },
              dom.td({ className: 'entry-name' }, dom.h2(null, entry.name)),
              dom.td({ className: 'entry-comment' }, dom.h3(null, entry.comment))
            ))
          )
        )
      ),
      dom.button(
        { className: 'btn btn-primary submit-order btn-lg btn-block', onClick: () => { this.props.addOrder(this.state.entries); } },
        'Submit'
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
