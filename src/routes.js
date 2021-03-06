import React from 'react';
import { Route as RouteComponent } from 'react-router';
import { AppContainer } from './components/App';
import Home from './components/Home';
import { OrdersContainer } from './components/Orders';
import { OrderDetailsContainer } from './components/OrderDetails';
import { NewOrderContainer } from './components/NewOrder';
import { ChefContainer } from './components/Chef';
import { BartenderContainer } from './components/Bartender';
import { ReportingContainer } from './components/Reporting';

const Route = React.createFactory(RouteComponent);

export default Route(
  { component: AppContainer },
  Route({ path: '/orders/new', component: NewOrderContainer }),
  Route({ path: '/orders/:id', component: OrderDetailsContainer }),
  Route({ path: '/orders', component: OrdersContainer }),
  Route({ path: '/chef', component: ChefContainer }),
  Route({ path: '/bartender', component: BartenderContainer }),
  Route({ path: '/reporting', component: ReportingContainer }),
  Route({ path: '/', component: Home })
);
