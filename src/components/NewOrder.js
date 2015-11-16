import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import MasterItemsComponent from './MasterItems';
import * as actions from '../action_creators';
import _ from 'underscore';

const MasterItems = createFactory(MasterItemsComponent);
const mapStateToProps = function (state) {
  return {
    masterItems: state.items
  };
};

class NewOrder extends Component {
  constructor(props) {
    super(props);
    this.updateEntries = this.updateEntries.bind(this);
    this.state = {
      entries: []
    };
  }

  componentWillMount() {
    this.props.loadItems();
  }

  updateEntries(entries) {
    this.setState({ entries });
  };

  removeEntry(entry) {
    const updatedEntries = _.without(this.state.entries, entry);

    this.setState({ entries: updatedEntries });
  }

  render() {
    return dom.div(
      null,
      MasterItems({
        masterItems: this.props.masterItems,
        handleUpdateEntries: this.updateEntries,
        entries: this.state.entries,
        title: 'New Order'
      }),
      dom.div(
        null,
        dom.table(
          { className: 'table table-striped' },
          dom.tbody(
            null,
            this.state.entries.map((entry, i) => dom.tr(
              { className: 'entries', key: i },
              dom.td({ className: 'entry-name' }, dom.h2(null, entry.name)),
              dom.td({ className: 'entry-comment' }, dom.h3(null, entry.comment)),
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
