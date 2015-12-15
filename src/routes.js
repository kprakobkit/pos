import React from 'react';
import { Route as RouteComponent } from 'react-router';
import App from './components/App';
import { HomeContainer } from './components/Home';
import { OrdersContainer } from './components/Orders';
import { OrderDetailsContainer } from './components/OrderDetails';
import { NewOrderContainer } from './components/NewOrder';
import { ChefContainer } from './components/Chef';
import { BartenderContainer } from './components/Bartender';

const Route = React.createFactory(RouteComponent);

export default Route(
  { component: App },
  Route({ path: '/orders/new', component: NewOrderContainer }),
  Route({ path: '/orders/:id', component: OrderDetailsContainer }),
  Route({ path: '/orders', component: OrdersContainer }),
  Route({ path: '/chef', component: ChefContainer }),
  Route({ path: '/bartender', component: BartenderContainer }),
  Route({ path: '/', component: HomeContainer })
);
