import { expect } from 'chai';
import $ from '../src/money';
import constants from '../src/constants';

describe('money', () => {
  const entries = [
    { status: constants.DELIVERED, price: 10 },
    { status: constants.DELIVERED, price: 20 },
    { status: constants.OPEN, price: 999 }
  ];
  const discounts = [
    { value: 0.2 },
    { value: 0.2 }
  ];
  const order = { entries, discounts };

  it('totalSales', () => {
    expect($.totalSales(entries)).to.equal(30);
  });

  it('discount', () => {
    expect($.discount(order)).to.equal(12);
  });

  it('subtotal', () => {
    expect($.subtotal(order)).to.equal(18);
  });
});
