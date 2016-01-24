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


export default {
  format,
  cents,
  dollars,
  totalSales
};
