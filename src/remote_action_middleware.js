export default (socket) => (store) => (next) => (action) => {
  const token = store.getState().token;
  debugger;

  if (action.meta && action.meta.remote && token) {
    socket.emit(action.type, action);
  } else if (action.meta && action.meta.remote && action.type === 'authentication') {
    socket.emit('authentication', action);
  } else {
    return next(action);
  }
};
