import constants from './constants';
import Cookies from 'js-cookie';

export default (socket) => (store) => (next) => (action) => {
  const { meta, onReceipt } = action;

  if (meta && meta.remote) {
    socket.emit(action.type, action);
  }

  if(onReceipt && socket.listeners(onReceipt.type).length === 0) {
    socket.on(onReceipt.type, onReceipt.onSuccess);
  }

  if(action.type === constants.LOGIN) {
    socket.emit('authentication', { pin: action.pin });
  }

  if(action.type === constants.LOGOUT) {
    Cookies.remove('_posToken');
  }

  return next(action);
};
