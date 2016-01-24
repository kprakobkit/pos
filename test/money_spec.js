import { expect } from 'chai';
import $ from '../src/money';
import constants from '../src/constants';

describe('money', () => {
  const entries = [
    { status: constants.DELIVERED, price: 1000 },
    { status: constants.DELIVERED, price: 2000 },
    { status: constants.OPEN, price: 999 }
  ];
  const discounts = [
    { value: 0.2 },
    { value: 0.2 }
  ];
  const order = { entries, discounts };

  it('totalSales', () => {
    expect($.totalSales(entries)).to.equal(3000);
  });

  it('discount', () => {
    expect($.discount(order)).to.equal(1200);
  });

  it('subtotal', () => {
    expect($.subtotal(order)).to.equal(1800);
  });

  it('tax', () => {
    expect($.tax(order)).to.equal(Math.round(157.5));
  });

  it('total', () => {
    expect($.total(order)).to.equal(1800 + Math.round(157.5));
  });
});
