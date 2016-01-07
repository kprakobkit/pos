import { Component, PropTypes, DOM as dom } from 'react';
import constants from '../../src/constants';
import _ from 'underscore';

const tableNumbers = _.range(1, 41).concat('TOGO', 'BAR');

class TableNumberSelect extends Component {
  render() {
    return (
      dom.select(
        { className: 'table-numbers input-lg form-control', value: this.props.tableNumber, onChange: this.props.handleOnChange },
        tableNumbers.map((num) => dom.option({ key: num, className: 'table-number', value: num }, num))
      )
    );
  }
}

TableNumberSelect.propTypes = {
  tableNumber: PropTypes.string.isRequired,
  handleOnChange: PropTypes.func.isRequired
};

export default TableNumberSelect;
