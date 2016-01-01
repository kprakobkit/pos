import { Component, PropTypes, DOM as dom } from 'react';
import constants from '../constants';

class CancelEntry extends Component {
  render() {
    return (
      dom.button(
        {
          className: 'btn btn-link btn-lg canceled',
          onClick: this.props.onCancel
        },
        dom.span({ className: 'text-danger' }, 'Cancel Entry')
      )
    );
  }
}

CancelEntry.propTypes = {
  onCancel: PropTypes.func.isRequired
};

export default CancelEntry;
