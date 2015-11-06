import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import createHistory from 'history/lib/createBrowserHistory';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import loggerMiddleware from 'redux-logger';
import routes from './routes';
import reducer from './reducer';
import { setState } from './action_creators';
import remoteActionMiddleware from './remote_action_middleware';
import io from 'socket.io-client';

require('./style.css');

const router   = React.createFactory(Router);
const provider = React.createFactory(Provider);

const thisDocument = window.document;
const port = thisDocument.location.hostname === 'localhost' ? ':3000' : '';
const location = `${thisDocument.location.protocol}//${thisDocument.location.hostname}${port}`;
const socket = io.connect(location);

const createStoreWithMiddleware = applyMiddleware(
  remoteActionMiddleware(socket),
  loggerMiddleware({ collapsed: true })
)(createStore);
const store = createStoreWithMiddleware(reducer);

socket.on('connected', (data) => console.log(data));
socket.on('state', (state) => store.dispatch(setState(state)));

const history = createHistory();

ReactDOM.render(
  provider(
    { store: store },
    router({ history }, routes)
  ),
  document.getElementById('app')
);
