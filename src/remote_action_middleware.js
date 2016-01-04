import constants from '../src/constants';

export default (socket) => (store) => (next) => (action) => {
  if (action.meta && action.meta.remote) {
    socket.emit(action.type, action);
  }

  if(action.type === constants.ADD_ORDER) {
    socket.on(constants.ADD_ORDER_SUCCESS, action.onSuccess);
  }

  return next(action);
};
