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
    this.removeEntry = this.removeEntry.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.state = {
      comment: '',
      entries: []
    };
  }

  handleAddEntry() {
    const selectedItem = _.extend({}, this.state.selectedItem || this.props.masterItems[0]);
    selectedItem.comment = this.state.comment;
    const entries = this.state.entries.concat(selectedItem);

    this.setState({ entries, comment: '' });
  }

  selectItem(itemId) {
    const selectedItem = _.extend({}, _.find(this.props.masterItems, (item) => item.id === itemId));

    this.setState({ selectedItem });
  }

  addComment(e) {
    const comment = e.target.value;

    this.setState({ comment });
  }

  removeEntry(entry) {
    const updatedEntries = _.without(this.state.entries, entry);

    this.setState({ entries: updatedEntries });
  }

  handleOnClick() {
    this.props.handleSubmit(this.state.entries);
    this.setState({ entries: [] });
  }

  render() {
    return dom.div(
      { className: 'master-items' },
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
          dom.span(
            {
              className: 'glyphicon glyphicon-plus',
              'aria-hidden': true
            }
          ),
          ' Add Item',
        )
      ),
      dom.div(
        null,
        dom.table(
          { className: 'table table-striped' },
          dom.tbody(
            null,
            this.state.entries.length > 0 ? this.state.entries.map((entry, i) => dom.tr(
              { className: 'entries', key: i },
              dom.td({ className: 'entry-name' }, dom.h2(null, entry.name)),
              dom.td({ className: 'entry-comment' }, dom.h2(null, dom.small(null, entry.comment))),
              dom.td(
                { className: 'entry-action' },
                dom.button(
                  {
                    className: 'btn btn-default remove-entry',
                    onClick: this.removeEntry.bind(this, entry)
                  },
                  dom.span(
                    {
                      className: 'glyphicon glyphicon-remove',
                      'aria-hidden': true
                    }
                  )
                )
              )
            )) : dom.tr({ className: 'no-entries' }, dom.td(null, dom.h2({ className: 'text-center text-danger lead' }, 'There is currently nothing to send to the kitchen.'))),
          )
        )
      ),
      dom.p(
        null,
        dom.button(
          { className: 'btn btn-primary submit-order btn-lg btn-block', onClick: this.handleOnClick },
          'Send to the kitchen'
        )
      )
    );
  }
}

export default MasterItems;
