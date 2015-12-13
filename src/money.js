import accounting from 'accounting';

function format(amount) {
  return accounting.formatMoney(dollars(amount));
}

function cents(dollars) {
  return parseInt(accounting.toFixed(dollars * 100, 0));
}

function dollars(cents) {
  return parseFloat(accounting.toFixed(cents / 100, 2));
}

export default {
  format,
  cents,
  dollars
};
