import React               from 'react';
import ReactDOM            from 'react-dom';
import { Router, Route }   from 'react-router';
import { createStore }     from 'redux';
import { Provider }        from 'react-redux';
import reducer             from './reducer';
import App                 from './components/App';
import { OrdersContainer } from './components/Orders';
import Hello               from './components/Hello';
import io                  from 'socket.io-client';

require('./style.css');

const router   = React.createFactory(Router);
const route    = React.createFactory(Route);
const provider = React.createFactory(Provider);

const store = createStore(reducer);
store.dispatch({
  type:  'SET_STATE',
  state: {
    orders: [
      { id: 1, status: 'open' },
      { id: 2, status: 'open' }
    ]
  }
});

const socket = io(`${location.protocol}//${location.hostname}:8090`);
socket.on('connected', (data) => {
  console.log(data);
});

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
