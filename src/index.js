import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import createHistory from 'history/lib/createBrowserHistory';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import loggerMiddleware from 'redux-logger';
import routes from './routes';
import reducer from './reducer';
import { setState, setUser, getInitialState } from './action_creators';
import remoteActionMiddleware from './remote_action_middleware';
import authenticationMiddleware from './authentication_middleware';
import io from 'socket.io-client';
import config from '../config';
import Cookies from 'js-cookie';

require('./style.css');

const router   = React.createFactory(Router);
const provider = React.createFactory(Provider);

const { protocol, hostname } = window.document.location;
let port = '';

if (config.demoMode || hostname.indexOf('local') > -1) {
  port = ':3210';
}

const location = `${protocol}//${hostname}${port}`;
const socket = io.connect(location);

const createStoreWithMiddleware = applyMiddleware(
  authenticationMiddleware(socket),
  remoteActionMiddleware(socket),
  loggerMiddleware({ collapsed: true })
)(createStore);
const store = createStoreWithMiddleware(reducer, window.__INITIAL_STATE__);

socket.on('authenticated', ({ user, token }) => {
  Cookies.set('_posToken', token);
  store.dispatch(setUser({ user, token }));
  store.dispatch(getInitialState());
});

const posToken = Cookies.get('_posToken');

if(posToken) {
  socket.emit('authentication', { token: posToken });
}

socket.on('state', (state) => store.dispatch(setState(state)));

const history = createHistory();

ReactDOM.render(
  provider(
    { store: store },
    router({ history }, routes)
  ),
  document.getElementById('app')
);
