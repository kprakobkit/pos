import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import MasterItemsSelectComponent from './MasterItemsSelect';
import R from 'ramda';
import _ from 'underscore';

const MasterItemsSelect = createFactory(MasterItemsSelectComponent);

function addEntriesByQuantity(entries) {
  let entriesWithQuantity = [];

  entries.forEach((entry) => {
    let { quantity } = entry;
    delete entry.quantity;

    R.times(() => {
      entriesWithQuantity = R.append(entry, entriesWithQuantity);
    }, quantity);
  });

  return entriesWithQuantity;
}

class MasterItems extends Component {
  constructor(props) {
    super(props);
    this.selectItem = this.selectItem.bind(this);
    this.handleAddEntry = this.handleAddEntry.bind(this);
    this.removeEntry = this.removeEntry.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.renderSelectedEntries = this.renderSelectedEntries.bind(this);
    this.renderNoEntries = this.renderNoEntries.bind(this);
    this.addComment = this.addComment.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.setQuantity = this.setQuantity.bind(this);
    this.state = {
      entries: []
    };
  }

  handleAddEntry() {
    const selectedItem = R.merge({ quantity: 1 }, this.state.selectedItem || this.props.masterItems[0]);
    const entries = this.state.entries.concat(selectedItem);

    this.setState({ entries });
  }

  selectItem(selectedItem) {
    this.setState({ selectedItem }, this.handleAddEntry);
  }

  removeEntry(entry, i) {
    const entries = _.without(this.state.entries, entry);

    this.setState({ entries });
  }

  handleOnClick() {
    const entriesWithQuantity = addEntriesByQuantity(this.state.entries);

    this.props.handleSubmit(entriesWithQuantity);
    this.setState({ entries: [] });
  }

  addComment(entryIndex, e) {
    const updatedEntry = this.state.entries[entryIndex];
    updatedEntry.comment = e.target.value;
    const updatedEntries = R.update(entryIndex, updatedEntry, this.state.entries);

    this.setState({ entries: updatedEntries });
  }

  setQuantity(entryIndex, e) {
    const updatedEntry = this.state.entries[entryIndex];
    updatedEntry.quantity = e.target.value;
    const updatedEntries = R.update(entryIndex, updatedEntry, this.state.entries);

    this.setState({ entries: updatedEntries });
  }

  handleKeyPress(e) {
    if(e.which === 13) {
      document.activeElement.blur();
    }
  }

  renderSelectedEntries() {
    return this.state.entries.map((entry, i) => dom.tr(
      { className: 'entries', key: i },
      dom.td({ className: 'entry-name col-xs-5' }, dom.h4(null, entry.name)),
      dom.td({ className: 'entry-comment col-xs-5' }, dom.input({
        className: `input form-control add-comment-${entry.name}`,
        onChange: this.addComment.bind(null, i),
        placeholder: 'Comment',
        onKeyPress: this.handleKeyPress,
        value: entry.comment
      })),
      dom.td({ className: 'entry-quantity col-xs-2' }, dom.input({
        className: `input form-control add-quantity-${entry.name}`,
        type: 'number',
        max: '50',
        onChange: this.setQuantity.bind(null, i),
        value: entry.quantity
      })),
      dom.td(
        { className: 'entry-action text-right' },
        dom.button(
          {
            className: 'btn btn-default remove-entry',
            onClick: this.removeEntry.bind(this, entry, i)
          },
          dom.span(
            {
              className: 'glyphicon glyphicon-remove',
              'aria-hidden': true
            }
          )
        )
      )
    ));
  }

  renderNoEntries() {
    return dom.tr(
      { className: 'no-entries' },
      dom.td(
        null,
        dom.h2(
          { className: 'text-center text-danger lead' }, 'There are no entries'
        )
      )
    );
  }

  render() {
    return dom.div(
      { className: 'row' },
      dom.div(
        { className: 'master-items col-md-6 col-sm-6' },
        MasterItemsSelect({
          masterItems: this.props.masterItems,
          onSelectMasterItem: this.selectItem
        })
      ),
      dom.div(
        { className: 'col-md-6 col-sm-6' },
        dom.table(
          { className: 'table table-striped' },
          dom.tbody(
            null,
            this.state.entries.length ? this.renderSelectedEntries() : this.renderNoEntries()
          )
        ),
        dom.p(
          null,
          dom.button(
            {
              className: 'btn btn-primary submit-order btn-lg btn-block',
              disabled: !this.state.entries.length,
              onClick: this.handleOnClick
            },
            'Send'
          )
        )
      )
    );
  }
}

export default MasterItems;
