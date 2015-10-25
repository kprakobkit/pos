export default (store) => (next) => (action) => {
  console.log('from middleware', action);
  return next(action);
}
