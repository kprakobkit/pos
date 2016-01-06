import constants from '../src/constants';

export default (socket) => (store) => (next) => (action) => {
  if (action.meta && action.meta.remote) {
    socket.emit(action.type, action);
  }

  if(action.onSuccess) {
    const { type, onSuccess } = action.onSuccess;

    socket.on(type, onSuccess);
  }

  return next(action);
};
