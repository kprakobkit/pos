import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import MasterItemsSelectComponent from './MasterItemsSelect';
import _ from 'underscore';

const MasterItemsSelect = createFactory(MasterItemsSelectComponent);

class MasterItems extends Component {
  constructor(props) {
    super(props);
    this.selectItem = this.selectItem.bind(this);
    this.addComment = this.addComment.bind(this);
    this.handleAddEntry = this.handleAddEntry.bind(this);
    this.state = {
      comment: ''
    };
  }

  handleAddEntry() {
    const selectedItem = _.extend({}, this.state.selectedItem || this.props.masterItems[0]);
    selectedItem.comment = this.state.comment;
    const entries = this.props.entries.concat(selectedItem);

    this.setState({ comment: '' });
    this.props.handleUpdateEntries(entries);
  }

  selectItem(itemId) {
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
      dom.h1({ className: 'title' }, this.props.title),
      MasterItemsSelect({
        masterItems: this.props.masterItems,
        onSelectMasterItem: this.selectItem
      }),
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
          { className: 'btn btn-default add-entry btn-lg btn-block', onClick: this.handleAddEntry },
          'Add Item'
        )
      ),
    );
  }
}

export default MasterItems;
