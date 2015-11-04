import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import createHistory from 'history/lib/createHashHistory';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import loggerMiddleware from 'redux-logger';
import reducer from './reducer';
import { setState } from './action_creators';
import remoteActionMiddleware from './remote_action_middleware';
import App from './components/App';
import { OrdersContainer } from './components/Orders';
import OrderDetails from './components/OrderDetails';
import { NewOrderContainer } from './components/NewOrder';
import Home from './components/Home';
import io from 'socket.io-client';

require('./style.css');

const router   = React.createFactory(Router);
const route    = React.createFactory(Route);
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

const routes = route(
  { component: App },
  route({ path: '/orders/new', component: NewOrderContainer }),
  route({ path: '/orders/:id', component: OrderDetails }),
  route({ path: '/orders', component: OrdersContainer }),
  route({ path: '/', component: Home })
);

const history = createHistory({ queryKey: false });

ReactDOM.render(
  provider(
    { store: store },
    router({ history }, routes)
  ),
  document.getElementById('app')
);
