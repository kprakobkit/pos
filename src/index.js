import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import createHistory from 'history/lib/createBrowserHistory';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import loggerMiddleware from 'redux-logger';
import routes from './routes';
import reducer from './reducer';
import { setState, setToken } from './action_creators';
import remoteActionMiddleware from './remote_action_middleware';
import io from 'socket.io-client';
import config from '../config';

require('./style.css');

const router   = React.createFactory(Router);
const provider = React.createFactory(Provider);

const thisDocument = window.document;
let port = '';

if (config.demoMode || thisDocument.location.hostname === 'localhost') {
  port = ':3210';
}

const location = `${thisDocument.location.protocol}//${thisDocument.location.hostname}${port}`;
const socket = io.connect(location);

const createStoreWithMiddleware = applyMiddleware(
  remoteActionMiddleware(socket),
  loggerMiddleware({ collapsed: true })
)(createStore);
const store = createStoreWithMiddleware(reducer, window.__INITIAL_STATE__);

socket.on('state', (state) => store.dispatch(setState(state)));
socket.on('authenticated', function(data) {
  store.dispatch(setToken(data.token)); // should also set logged in user.
});
socket.on('unauthorized', function(err) {
  console.log('There was an error with the authentication: ', err.message);
});

const history = createHistory();

ReactDOM.render(
  provider(
    { store: store },
    router({ history }, routes)
  ),
  document.getElementById('app')
);
