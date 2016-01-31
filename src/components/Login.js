import { Component, DOM as dom, createFactory, PropTypes } from 'react';
import { Link as LinkComponent } from 'react-router';
import _ from 'ramda';

const Link = createFactory(LinkComponent);

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    const pin = this.refs.pin.value;
    this.props.login(pin);
  }

  render() {
    return (
      dom.div(
        { className: 'login-form' },
        dom.form(
          { className: 'col-xs-4 col-xs-offset-4' },
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
            onClick: this.handleClick
          }, 'Log In')
        )
      )
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired
};

export default Login;
