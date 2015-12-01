function labelForField(field) {
  return {
    cash: 'Cash',
    credit: 'Credit',
    tip: 'Tip in Credit'
  }[field];
}

export default {
  labelForField
};
