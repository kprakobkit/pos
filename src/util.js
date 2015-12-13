function labelForField(field) {
  return {
    cash: 'Paid in Cash',
    credit: 'Paid in Credit',
    tip: 'Tip in Credit'
  }[field];
}

export default {
  labelForField
};
