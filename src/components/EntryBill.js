import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import constants from '../constants';
import $ from '../money';
import _ from 'ramda';
import moment from 'moment';
import ButtonWithConfirmationComponent from './ButtonWithConfirmation';

const ButtonWithConfirmation = createFactory(ButtonWithConfirmationComponent);

class EntryBill extends Component {
  render() {
    const { name, quantity, price } = this.props;
    const total = quantity * price;

    return dom.tr(
      { className: 'order-entry' },
      dom.td(
        { className: 'entry-name col-xs-3' },
        dom.p(null, dom.strong(null, name))
      ),
      dom.td({ className: 'entry-quantity' }, dom.p(null, ` x ${ quantity }`)),
      dom.td(
        { className: 'entry-total text-right' },
        dom.p(null, $.format(total))
      )
    );
  }
}

EntryBill.propTypes = {
  name: PropTypes.string.isRequired,
  quantity: PropTypes.number,
  price: PropTypes.number
};

EntryBill.defaultProps = {
  comment: '',
  quantity: 1
};

export default EntryBill;
