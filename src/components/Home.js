import { Component, DOM as dom, createFactory } from 'react';
import { Link as LinkComponent } from 'react-router';
import { connect } from 'react-redux';
import { login } from '../action_creators';

const Link = createFactory(LinkComponent);
function mapStateToProps(state) {
  return {
    orders: state.orders
  };
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const username = this.refs.username.value;
    const password = this.refs.password.value;
    this.props.login(username, password);
  }

  render() {
    return (
      dom.div(
        null,
        dom.h1(null, 'Home'),
        dom.p(null, Link({ to: '/orders', className: 'orders-link' }, 'Orders')),
        dom.p(null, Link({ to: '/chef', className: 'chef-link' }, 'Chef')),
        dom.label(null, 'username'),
        dom.input({ ref: 'username' }),
        dom.label(null, 'password'),
        dom.input({ ref: 'password' }),
        dom.button({ onClick: this.handleClick }, 'Login')
      )
    );
  }
}

export default Home;
export const HomeContainer = connect(mapStateToProps, { login })(Home);
