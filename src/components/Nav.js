import { Component, DOM as dom, createFactory } from 'react';
import { Link as LinkComponent } from 'react-router';

const Link = createFactory(LinkComponent);

class Nav extends Component {
  render() {
    return (
      dom.div(
        { className: 'clearfix' },
        dom.ul(
          { className: 'nav nav-pills pull-right' },
          dom.li(null, Link({ to: '/orders', className: 'nav-orders-link' }, dom.h4(null, 'Orders'))),
          dom.li(null, Link({ to: '/chef', className: 'nav-chef-link' }, dom.h4(null, 'Chef'))),
          dom.li(null, Link({ to: '/bartender', className: 'nav-bartender-link' }, dom.h4(null, 'Bartender')))
        )
      )
    );
  }
}

export default Nav;
