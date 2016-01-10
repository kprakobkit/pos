import { Component, PropTypes, DOM as dom } from 'react';
import constants from '../constants';

class ButtonWithConfirmation extends Component {
  constructor(props) {
    super(props);
    this.toggleConfirmation = this.toggleConfirmation.bind(this);
    this.state = {
      showConfirmation: false
    };
  }

  toggleConfirmation() {
    this.setState({ showConfirmation: !this.state.showConfirmation });
  }

  render() {
    return (
      dom.div(
        { className: 'text-center' },
        this.state.showConfirmation ?
          [dom.button(
            {
              key: 'confirm-cancel',
              className: 'btn btn-danger btn-sm confirm',
              onClick: this.props.onConfirmation
            },
            this.props.confirmationText
        ),
        dom.button(
          {
            key: 'back',
            className: 'btn btn-link btn-sm back',
            onClick: this.toggleConfirmation
          },
          dom.span(null, 'Back')
        )] :
          dom.button(
            {
              className: 'btn btn-danger btn-block btn-sm button-action',
              onClick: this.toggleConfirmation
            },
            this.props.actionText
        )
      )
    );
  }
}

ButtonWithConfirmation.propTypes = {
  onConfirmation: PropTypes.func.isRequired,
  confirmationText: PropTypes.string.isRequired,
  actionText: PropTypes.string.isRequired
};

export default ButtonWithConfirmation;
