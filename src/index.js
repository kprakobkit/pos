import React             from 'react';
import ReactDOM          from 'react-dom';
import { Router, Route } from 'react-router';
import { createStore }   from 'redux';
import { Provider }      from 'react-redux';
import reducer           from './reducer';
import App               from './components/App';
import Orders            from './components/Orders';
import Hello             from './components/Hello';
import Voting            from './components/Voting';
import Results           from './components/Results';

require('./style.css');

const router   = React.createFactory(Router);
const route    = React.createFactory(Route);
const provider = React.createFactory(Provider);

const store = createStore(reducer);
store.dispatch({
  type:  'SET_STATE',
  state: {
    vote: {
      pair:  ['Sunshine', '28 Days Later'],
      tally: { Sunshine: 2 }
    }
  }
});

const routes = route(
  { component: App },
  route({ path: '/orders', component: Orders }),
  route({ path: '/', component: Hello })
);

ReactDOM.render(
  provider(
    { store: store },
    router(null, routes)
  ),
  document.getElementById('app')
);
