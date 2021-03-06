import { Component, PropTypes, DOM as dom } from 'react';
import constants from '../../src/constants';
import _ from 'underscore';

const barTables = _.range(1, 7).map((num) => `BAR${num}`);
const adhocTables = _.range(1, 10).map((num) => `*${num}`);
const tableNumbers = _.range(1, 41).concat('TOGO', barTables, adhocTables);

class TableNumberSelect extends Component {
  render() {
    return (
      dom.select(
        { className: 'table-number-select form-control', value: this.props.tableNumber, onChange: this.props.handleOnChange },
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
