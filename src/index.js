import React               from 'react';
import ReactDOM            from 'react-dom';
import { Router, Route }   from 'react-router';
import { createStore }     from 'redux';
import { Provider }        from 'react-redux';
import reducer             from './reducer';
import { setState }        from './action_creators';
import App                 from './components/App';
import { OrdersContainer } from './components/Orders';
import Hello               from './components/Hello';
import io                  from 'socket.io-client';

require('./style.css');

const router   = React.createFactory(Router);
const route    = React.createFactory(Route);
const provider = React.createFactory(Provider);

const store = createStore(reducer);

const socket = io(`${location.protocol}//${location.hostname}:8090`);
socket.on('connected', (data) => console.log(data));
socket.on('state', (state) => store.dispatch(setState(state)));

const routes = route(
  { component: App },
  route({ path: '/orders', component: OrdersContainer }),
  route({ path: '/', component: Hello })
);

ReactDOM.render(
  provider(
    { store: store },
    router(null, routes)
  ),
  document.getElementById('app')
);
