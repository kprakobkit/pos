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
    this.renderSelectedEntries = this.renderSelectedEntries.bind(this);
    this.renderNoEntries = this.renderNoEntries.bind(this);
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

  selectItem(selectedItem) {
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

  renderSelectedEntries() {
    return this.state.entries.map((entry, i) => dom.tr(
      { className: 'entries', key: i },
      dom.td({ className: 'entry-name' }, dom.h3(null, entry.name)),
      dom.td({ className: 'entry-comment' }, dom.p(null, dom.small(null, entry.comment))),
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
          'There is currently nothing to send to the kitchen.'
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
            {
              className: 'btn btn-default add-entry btn-lg btn-block',
              onClick: this.handleAddEntry
            },
            dom.span(
              {
                className: 'glyphicon glyphicon-plus',
                'aria-hidden': true
              }
            ),
            ' Add Item',
          )
        ),
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
            'Send to the kitchen'
          )
        )
      )
    );
  }
}

export default MasterItems;
