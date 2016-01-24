import { expect } from 'chai';
import $ from '../src/money';
import constants from '../src/constants';

describe('money', () => {
  it('totalSales',() => {
    const entries = [
      { status: constants.DELIVERED, price: 10 },
      { status: constants.DELIVERED, price: 20 },
      { status: constants.OPEN, price: 999 }
    ];

    expect($.totalSales(entries)).to.equal(30);
  });
});
