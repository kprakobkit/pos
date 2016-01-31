import { connect } from 'react-redux';
import { Component, DOM as dom, PropTypes, createFactory } from 'react';
import NavComponent from './Nav';
import LoginComponent from './Login';
import { login, logout } from '../action_creators';

const Nav = createFactory(NavComponent);
const Login = createFactory(LoginComponent);

function mapStateToProps(state) {
  return {
    user: state.user,
    isLoading: state.isLoading
  };
}

class App extends Component {
  renderHeader() {
    const { location } = this.props;

    return dom.div(
      { className: 'row' },
      dom.div(
        { className: 'col-sm-6' },
        dom.span(null, `Hi, ${ this.props.user.name }`),
        dom.a({
          className: 'btn btn-link',
          role: 'button',
          onClick: this.props.logout
        }, 'logout'),
      ),
      location.pathname === '/'
        ? null
        : dom.div({ className: 'col-sm-6' }, Nav())
    );
  }

  main() {
    return(
      dom.div(
        { className: 'container-fluid' },
        this.renderHeader(),
        this.props.children
      )
    );
  }

  render() {
    const { login, isLoading, user } = this.props;

    return (
      dom.div(
        { className: 'container-fluid' },
        user ?
          (!isLoading ? this.main() : dom.h1(null, 'loading...')) : Login({ login })
      )
    );
  }
}

App.propTypes = {
  user: PropTypes.object
};

export default App;
export const AppContainer = connect(mapStateToProps, { login, logout })(App);
