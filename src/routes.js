import React from 'react';
import { Route as RouteComponent } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import { OrdersContainer } from './components/Orders';
import OrderDetails from './components/OrderDetails';
import { NewOrderContainer } from './components/NewOrder';

const Route = React.createFactory(RouteComponent);

export default Route(
  { component: App },
  Route({ path: '/orders/new', component: NewOrderContainer }),
  Route({ path: '/orders/:id', component: OrderDetails }),
  Route({ path: '/orders', component: OrdersContainer }),
  Route({ path: '/', component: Home })
);