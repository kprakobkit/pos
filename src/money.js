import accounting from 'accounting';

function format(amount) {
  return accounting.formatMoney(accounting.toFixed(amount / 100, 2));
}

function cents(dollars) {
  return accounting.toFixed(dollars * 100, 0);
}

export default {
  format,
  cents
};
