import { connect } from 'react-redux';
import { Component, DOM as dom, PropTypes, createFactory } from 'react';
import NavComponent from './Nav';
import { login, logout } from '../action_creators';

const Nav = createFactory(NavComponent);

function mapStateToProps(state) {
  return {
    user: state.user,
    isLoading: state.isLoading
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(e) {
    e.preventDefault();
    const pin = this.refs.pin.value;
    this.props.login(pin);
  }

  login() {
    return (
      dom.div(
        { className: 'login-form' },
        dom.form(
          { className: 'col-xs-4 col-xs-offset-4 col-sm-4 col-sm-offset-4' },
          dom.h1(null, 'pos.'),
          dom.div(
            { className: 'form-group' },
            dom.input({
              className: 'form-control',
              type: 'number',
              ref: 'pin',
              placeholder: 'PIN'
            }),
          ),
          dom.button({
            className: 'btn btn-primary',
            type: 'submit',
            onClick: this.handleLogin
          }, 'Log In')
        )
      )
    );
  }

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
    return (
      dom.div(
        { className: 'container-fluid' },
        this.props.user ?
          (!this.props.isLoading ? this.main() : dom.h1(null, 'loading...')) : this.login()
      )
    );
  }
}

App.propTypes = {
  user: PropTypes.object
};

export default App;
export const AppContainer = connect(mapStateToProps, { login, logout })(App);
