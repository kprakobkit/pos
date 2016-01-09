import { Component, PropTypes, DOM as dom } from 'react';
import constants from '../constants';

class CancelEntry extends Component {
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
              className: 'btn btn-danger btn-sm confirm-cancel',
              onClick: this.props.onCancel
            },
            dom.span(null, 'Confirm Cancel Entry')
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
              className: 'btn btn-link btn-block btn-sm cancel-entry',
              onClick: this.toggleConfirmation
            },
            dom.span({ className: 'text-danger' }, 'Cancel Entry')
        )
      )
    );
  }
}

CancelEntry.propTypes = {
  onCancel: PropTypes.func.isRequired
};

export default CancelEntry;
