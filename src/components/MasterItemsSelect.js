import { Component, PropTypes, DOM as dom } from 'react';
import _ from 'ramda';

class MasterItemsSelect extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    const filteredItems = this.filterItems(this.props.masterItems[0].category);
    this.state = {
      filteredItems,
      selectedItemId: filteredItems[0].id
    };
  };

  getCategories(masterItems) {
    return _.uniq(_.pluck('category', masterItems));
  }

  filterItems(category) {
    return _.filter(_.propEq('category', category), this.props.masterItems);
  }

  handleChange(e) {
    const itemId = e.target.value;
    const selectedItem = _.find(_.propEq('id', itemId), this.props.masterItems);
    this.props.onSelectMasterItem(selectedItem);
    this.setState({ selectedItemId: selectedItem.id });
  }

  handleChangeCategory(category) {
    const filteredItems = this.filterItems(category);
    this.props.onSelectMasterItem(filteredItems[0]);
    this.setState({
      filteredItems,
      selectedItemId: filteredItems[0].id
    });
  }

  render() {
    return (
      dom.div(
        null,
        dom.div(
          { className: 'form-group' },
          dom.div(
            { className: 'select-category' },
            this.getCategories(this.props.masterItems).map((category, i) => {
              return dom.button({ className: `category category-${category}`, key: i, onClick: this.handleChangeCategory.bind(null, category) }, category);
            })
          )
        ),
        dom.div(
          { className: 'form-group' },
          dom.label(null, 'Item'),
          dom.select(
            { className: 'select-item form-control input-lg', onChange: this.handleChange, value: this.state.selectedItemId },
            this.state.filteredItems.map((item, i) => {
              return dom.option({ className: 'item', value: item.id, key: i }, item.name);
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

