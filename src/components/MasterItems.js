import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import MasterItemsSelectComponent from './MasterItemsSelect';
import R from 'ramda';
import _ from 'underscore';

const MasterItemsSelect = createFactory(MasterItemsSelectComponent);

function entriesByQuantity(entries) {
    const duplicate = entry => R.repeat(R.dissoc('quantity', entry), entry.quantity || 1);
    return R.chain(duplicate, entries);
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

  removeEntry(entry) {
    const entries = _.without(this.state.entries, entry);

    this.setState({ entries });
  }

  handleOnClick() {
    this.props.handleSubmit(entriesByQuantity(this.state.entries));
    this.setState({ entries: [] });
  }

  addComment(entryIndex, e) {
    const updatedEntry = R.assoc('comment', e.target.value, this.state.entries[entryIndex]);
    const updatedEntries = R.update(entryIndex, updatedEntry, this.state.entries);

    this.setState({ entries: updatedEntries });
  }

  setQuantity(entryIndex, change) {
    const entry = this.state.entries[entryIndex];
    const newQuantity = entry.quantity + change;

    if (newQuantity < 1) return;

    const updatedEntry = R.assoc('quantity', newQuantity, entry);
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
      dom.td({ className: 'entry-name col-xs-5' }, dom.p(null, entry.name)),
      dom.td(
        { className: 'entry-comment col-xs-4' },
        dom.input(
          {
            className: `input form-control add-comment-${entry.name}`,
            onChange: this.addComment.bind(null, i),
            placeholder: 'Comment',
            onKeyPress: this.handleKeyPress,
            value: entry.comment
          }
        )
      ),
      dom.td(
        { className: 'entry-quantity col-xs-3 row' },
        dom.button(
          {
            className: 'entry-quantity-decrease btn btn-default col-xs-4',
            onClick: this.setQuantity.bind(this, i, -1)
          },
          dom.span(
            {
              className: 'glyphicon glyphicon-minus',
              'aria-hidden': true
            }
          )
        ),
        dom.span(
          { className: 'entry-quantity-value col-xs-4 text-center' },
          entry.quantity
        ),
        dom.button(
          {
            className: 'entry-quantity-increase btn btn-default col-xs-4',
            onClick: this.setQuantity.bind(this, i, 1)
          },
          null,
          dom.span(
            {
              className: 'glyphicon glyphicon-plus',
              'aria-hidden': true
            }
          )
        ),
      ),
      dom.td(
        { className: 'entry-action text-right' },
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
              className: 'btn btn-primary submit-order btn-block',
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
