import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import _ from 'ramda';
import $ from '../money';
import moment from 'moment';

class ReportingPayments extends Component {
  constructor(props) {
    super(props);
    this.transactionsByDate = this.transactionsByDate.bind(this);
    this.paymentsByDate = this.paymentsByDate.bind(this);
    this.renderPaymentsByDate = this.renderPaymentsByDate.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
  }

  dateRange() {
    const today = moment().startOf('day');
    return _.map((days) => moment(today).subtract(days, 'days'), _.reverse(_.range(0, 7)));
  }

  appendTransaction(transactions, transaction) {
    const date = moment(transaction).startOf('day');
    const existing = transactions[date] || [];
    return _.assoc(date, _.append(transaction, existing), transactions);
  }

  transactionsByDate() {
    return _.reduce(this.appendTransaction, {}, this.props.transactions);
  }

  paymentsByDate(type) {
    return this.dateRange().map((date) => {
      const transactionsForDate = _.prop(date, this.transactionsByDate());
      return transactionsForDate ? _.sum(_.pluck(type, transactionsForDate)) : 0;
    });
  }

  renderPaymentsByDate(type) {
    return this.paymentsByDate(type).map((amount, i) => {
      return dom.td({ key: i }, $.format(amount));
    });
  }

  renderHeader() {
    return this.dateRange().map((date) => {
      return dom.th({ key: date }, date.format('M/D'));
    });
  }

  render() {
    return (
      dom.div(
        null,
        dom.h2(null, 'Payments'),
        dom.table(
          { className: 'table' },
          dom.thead(
            null,
            dom.tr(
              { className: 'reporting-payments-header' },
              dom.th(null, 'Payment Type'),
              this.renderHeader()
            )
          ),
          dom.tbody(
            null,
            dom.tr(
              null,
              dom.td(null, 'Credit'),
              this.renderPaymentsByDate('credit')
            ),
            dom.tr(
              null,
              dom.td(null, 'Cash'),
              this.renderPaymentsByDate('cash')
            ),
            dom.tr(
              { className: 'reporting-payments-total active' },
              dom.td(null, 'Total'),
              this.renderPaymentsByDate('total')
            )
          )
        )
      )
    );
  }
}

ReportingPayments.propTypes = {
  transactions: PropTypes.array.isRequired
};

export default ReportingPayments;
