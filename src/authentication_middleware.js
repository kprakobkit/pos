import constants from './constants';
import Cookies from 'js-cookie';

export default (socket) => (store) => (next) => (action) => {
  if (action.type === constants.LOGIN) {
    socket.emit('authentication', { pin: action.pin });
  }

  if (action.type === constants.LOGOUT) {
    Cookies.set('_posToken', '');
  }

  return next(action);
};
