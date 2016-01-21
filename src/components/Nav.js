import { Component, DOM as dom, createFactory, PropTypes } from 'react';
import { Link as LinkComponent } from 'react-router';
import _ from 'ramda';

const Link = createFactory(LinkComponent);

class Nav extends Component {
  render() {
    const { location } = this.context;

    return (
      dom.div(
        { className: 'clearfix' },
        dom.ul(
          { className: 'nav nav-pills pull-right' },
          location.pathname.indexOf('/orders') > -1 ?
            dom.li(
              null, Link({ to: '/orders', className: 'nav-orders-link' }, dom.span(null, 'Orders'))
          ) : null,
          dom.li(null, Link({ to: '/', className: 'nav-home-link' }, dom.span(null, 'Home')))
        )
      )
    );
  }
}

Nav.contextTypes = {
  location: PropTypes.object
};

export default Nav;
