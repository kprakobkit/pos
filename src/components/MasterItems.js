import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import MasterItemsSelectComponent from './MasterItemsSelect';
import R from 'ramda';
import _ from 'underscore';

const MasterItemsSelect = createFactory(MasterItemsSelectComponent);

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
    this.state = {
      entries: []
    };
  }

  handleAddEntry() {
    const selectedItem = R.merge({}, this.state.selectedItem || this.props.masterItems[0]);
    const entries = this.state.entries.concat(selectedItem);

    this.setState({ entries });
  }

  selectItem(selectedItem) {
    this.setState({ selectedItem });
  }

  removeEntry(entry) {
    const updatedEntries = _.without(this.state.entries, entry);

    this.setState({ entries: updatedEntries });
  }

  handleOnClick() {
    this.props.handleSubmit(this.state.entries);
    this.setState({ entries: [] });
  }

  addComment(entryIndex, e) {
    const updatedEntry = this.state.entries[entryIndex];
    updatedEntry.comment = e.target.value;
    const updatedEntries = R.update(entryIndex, updatedEntry, this.state.entries);

    this.setState({ entries: updatedEntries });
  }

  renderSelectedEntries() {
    return this.state.entries.map((entry, i) => dom.tr(
      { className: 'entries', key: i },
      dom.td({ className: 'entry-name col-xs-4' }, dom.h4(null, entry.name)),
      dom.td({ className: 'entry-comment col-xs-5' }, dom.input({
        className: `input form-control add-comment-${entry.name}`,
        onChange: this.addComment.bind(null, i)
      })),
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
          { className: 'text-center text-danger lead' },
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
          onSelectMasterItem: this.selectItem,
          onAddItem: this.handleAddEntry
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
