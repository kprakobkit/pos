import { Component, PropTypes, DOM as dom } from 'react';
import _ from 'underscore';

class MasterItemsSelect extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.state = {
      filteredItems: this.filterItems(this.props.masterItems[0].category)
    };
  };

  getCategories(masterItems) {
    return masterItems.map((item) => item.category);
  }

  filterItems(category) {
    return this.props.masterItems.filter((item) => item.category === category);
  }

  handleChange(e) {
    const itemId = e.target.value;
    const selectedItem = _.find(this.props.masterItems, (item) => item.id === itemId);
    this.props.onSelectMasterItem(selectedItem);
  }

  handleChangeCategory(e) {
    const selectedCategory = e.target.value;
    const filteredItems = this.filterItems(selectedCategory);;

    this.props.onSelectMasterItem(filteredItems[0]);
    this.setState({ filteredItems });
  }

  render() {
    return (
      dom.div(
        null,
        dom.div(
          { className: 'form-group' },
          dom.label(null, 'Category'),
          dom.select(
            { className: 'categories form-control input-lg', onChange: this.handleChangeCategory },
            _.uniq(this.getCategories(this.props.masterItems)).map((category, i) => {
              return dom.option({ className: 'category', value: category, key: i }, category);
            })
          )
        ),
        dom.div(
          { className: 'form-group' },
          dom.label(null, 'Item'),
          dom.select(
            { className: 'select-items form-control input-lg', onChange: this.handleChange },
            this.state.filteredItems.map((item, i) => {
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
  masterItems: [{}]
};

export default MasterItemsSelect;

