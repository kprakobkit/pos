import { Component, DOM as dom, createFactory } from 'react';
import { Link as LinkComponent } from 'react-router';

const Link = createFactory(LinkComponent);

class Home extends Component {
  render() {
    return (
      dom.div(
        null,
        dom.h1({ className: 'text-center' }, 'pos.'),
        dom.div(
          { className: 'row menu' },
          Link({ to: '/orders', className: 'col-xs-4 col-sm-4 menu-option orders-link' }, 'Orders'),
          Link({ to: '/chef', className: 'col-xs-4 col-sm-4 menu-option chef-link' }, 'Chef'),
          Link({ to: '/reporting', className: 'col-xs-4 col-sm-4 menu-option chef-link' }, 'Reporting')
        )
      )
    );
  }
}

export default Home;
