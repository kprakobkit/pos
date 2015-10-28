import { Component, DOM as dom, createFactory } from 'react';
import { Link as LinkComponent } from 'react-router';

const Link = createFactory(LinkComponent);

class Home extends Component {
  render() {
    return (
      dom.div(
        null,
        dom.h1(null, 'Home'),
        Link({ to: '/orders', className: 'orders-link' }, 'Orders')
      )
    );
  }
}

export default Home;
