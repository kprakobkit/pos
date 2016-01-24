import _ from 'ramda';
import accounting from 'accounting';
import constants from './constants';

function format(amount) {
  return accounting.formatMoney(dollars(amount));
}

function cents(dollars) {
  return parseInt(accounting.toFixed(dollars * 100, 0));
}

function dollars(cents) {
  return parseFloat(accounting.toFixed(cents / 100, 2));
}

function totalSales(entries) {
  return entries
    .filter((entry) => entry.status === constants.DELIVERED)
    .reduce((sum, entry) => sum + entry.price, 0);
}

function discount({ entries, discounts }) {
  const percentage = _.sum(_.pluck('value', discounts));
  return Math.round(totalSales(entries) * percentage);
}

function subtotal(order) {
  return totalSales(order.entries) - discount(order);
}

function tax(order) {
  return Math.round(subtotal(order) * constants.TAX_RATE);
}

function total(order) {
  return subtotal(order) + tax(order);
}

export default {
  format,
  cents,
  dollars,
  totalSales,
  discount,
  subtotal,
  tax,
  total
};
