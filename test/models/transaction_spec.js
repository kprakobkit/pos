import { expect } from 'chai';
import utils from '../utils';
import Transaction from '../../models/transaction';

describe('Transaction', () => {
  it ('saves with cash, credit, tip, and total amounts', function () {
    const orderId = '12345';
    const cash = 1000;
    const credit = 2000;
    const tip = 500;
    const amounts = { cash, credit, tip };

    return Transaction.addTransaction(orderId, amounts)
      .then((transaction) => {
        expect(transaction.orderId).to.equal(orderId);
        expect(transaction.cash).to.equal(cash);
        expect(transaction.credit).to.equal(credit);
        expect(transaction.tip).to.equal(tip);
        expect(transaction.total).to.equal(cash + credit);
      });
  });
});