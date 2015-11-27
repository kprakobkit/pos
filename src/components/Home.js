import { Component, DOM as dom, createFactory } from 'react';
import { Link as LinkComponent } from 'react-router';

const Link = createFactory(LinkComponent);

class Home extends Component {
  render() {
    return (
      dom.div(
        null,
        dom.h1(null, 'Home'),
        dom.p(null, Link({ to: '/orders', className: 'orders-link' }, 'Orders')),
        dom.p(null, Link({ to: '/chef', className: 'chef-link' }, 'Chef'))
      )
    );
  }
}

export default Home;
