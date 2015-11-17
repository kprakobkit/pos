import { Component, DOM as dom } from 'react';

export default (wrapped) => {
  return class TableComponent extends Component {
    render() {
      return dom.table(
        null,
        dom.tbody(
          null,
          wrapped(this.props)
        )
      );
    };
  };
};
