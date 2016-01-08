import constants from '../src/constants';

export default (socket) => (store) => (next) => (action) => {
  const { meta, onReceipt } = action;

  if (meta && meta.remote) {
    socket.emit(action.type, action);
  }

  if(onReceipt && socket.listeners(onReceipt.type).length === 0) {
    socket.on(onReceipt.type, onReceipt.onSuccess);
  }

  return next(action);
};
