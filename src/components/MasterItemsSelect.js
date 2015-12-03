import { Component, PropTypes, DOM as dom } from 'react';
import _ from 'underscore';

class MasterItemsSelect extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  };

  handleChange(e) {
    const itemId = e.target.value;
    const selectedItem = _.extend({}, _.find(this.props.masterItems, (item) => item.id === itemId));
    this.props.onSelectMasterItem(selectedItem);
  }

  getCategories(masterItems) {
    return masterItems.map((item) => item.category);
  }

  render() {
    return (
      dom.div(
        null,
        dom.div(
          { className: 'form-group' },
          dom.select(
            { className: 'categories form-control input-lg' },
            _.uniq(this.getCategories(this.props.masterItems)).map((category, i) => {
              return dom.option({ className: 'category', value: category, key: i }, category);
            })
          )
        ),
        dom.div(
          { className: 'form-group' },
          dom.select(
            { className: 'select-items form-control input-lg', onChange: this.handleChange },
            this.props.masterItems.map((item, i) => {
              return dom.option({ className: 'option', value: item.id, key: i + 1 }, item.name);
            })
          )
        )
      )
    );
  }
}

MasterItemsSelect.propTypes = {
  masterItems: PropTypes.array.isRequired
};

MasterItemsSelect.defaultProps = {
  masterItems: []
};

export default MasterItemsSelect;

