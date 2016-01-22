import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import _ from 'ramda';
import $ from '../money';
import moment from 'moment';

class ReportingPayments extends Component {
  constructor(props) {
    super(props);
    this.dateRange = this.dateRange.bind(this);
    this.setLookback = this.setLookback.bind(this);
    this.transactionsByDate = this.transactionsByDate.bind(this);
    this.paymentsByDate = this.paymentsByDate.bind(this);
    this.renderPaymentsByDate = this.renderPaymentsByDate.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.state = {
      lookback: 7
    };
  }

  dateRange() {
    const today = moment().startOf('day');
    return _.map((days) => moment(today).subtract(days, 'days'), _.reverse(_.range(0, this.state.lookback)));
  }

  setLookback(e) {
    const lookback = parseInt(e.target.value);
    this.setState({ lookback });
  }

  appendTransaction(transactions, transaction) {
    const date = moment(transaction.createdAt).format('L');
    const existing = transactions[date] || [];
    return _.assoc(date, _.append(transaction, existing), transactions);
  }

  transactionsByDate() {
    return _.reduce(this.appendTransaction, {}, this.props.transactions);
  }

  paymentsByDate(type) {
    return this.dateRange().map((date) => {
      const transactionsForDate = _.prop(date.format('L'), this.transactionsByDate());
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

  renderRow(row) {
    return dom.tr(
      { key: row, className: `reporting-payments-${row}` },
      dom.td({ className: 'text-capitalize' }, row),
      this.renderPaymentsByDate(row)
    );
  }

  render() {
    return (
      dom.div(
        { onChange: this.setLookback },
        dom.h2(null, 'Payments'),
        dom.select(
          null,
          dom.option({ value: 7 }, '1 Week'),
          dom.option({ value: 14 }, '2 Weeks'),
          dom.option({ value: 21 }, '3 Weeks'),
          dom.option({ value: 30 }, '1 Month')
        ),
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
            ['credit', 'cash', 'tip', 'total'].map(this.renderRow)
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
