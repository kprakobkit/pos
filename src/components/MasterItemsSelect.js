import { Component, PropTypes, DOM as dom } from 'react';
import _ from 'ramda';
import $ from '../money';

class MasterItemsSelect extends Component {
  constructor(props) {
    super(props);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.isActiveCategory = this.isActiveCategory.bind(this);
    this.handleAddEntry = this.handleAddEntry.bind(this);
    const filteredItems = this.filterItems(this.props.masterItems[0].category);
    this.state = {
      filteredItems,
      selectedItemId: filteredItems[0].id,
      selectedCategory: filteredItems[0].category
    };
  };

  getCategories(masterItems) {
    return _.pipe(
      _.sortBy(_.prop('category')),
      _.pluck('category'),
      _.uniq,
    )(masterItems);
  }

  filterItems(category) {
    return _.pipe(
      _.filter(_.propEq('category', category)),
      _.sortBy(_.prop('name'))
    )(this.props.masterItems);
  }

  handleAddEntry(itemId) {
    const selectedItem = _.find(_.propEq('id', itemId), this.props.masterItems);
    this.setState({ selectedItemId: selectedItem.id });
    this.props.onSelectMasterItem(selectedItem);
  }

  handleChangeCategory(category) {
    const filteredItems = this.filterItems(category);
    this.setState({
      filteredItems,
      selectedItemId: filteredItems[0].id,
      selectedCategory: category
    });
  }

  isActiveCategory(category) {
    if(this.state.selectedCategory === category) {
      return 'active';
    }
  }

  isActiveItem(itemId) {
    if(this.state.selectedItemId === itemId) {
      return 'info';
    }
  }

  render() {
    return (
      dom.div(
        null,
        dom.div(
          { className: 'text-center' },
          dom.div(
            { className: 'select-category' },
            this.getCategories(this.props.masterItems).map((category, i) => {
              return dom.button({
                type: 'button',
                className: `btn btn-default btn-sm category category-${category} ${this.isActiveCategory(category)}`,
                key: i,
                onClick: this.handleChangeCategory.bind(null, category)
              }, category);
            })
          )
        ),
        dom.div(
          { className: 'items-table' },
          dom.table(
            { className: 'table table-hover table-condensed' },
            dom.tbody(
              { className: 'select-item' },
              this.state.filteredItems.map((item, i) => {
                return dom.tr(
                  {
                    className: `item item-${item.name} ${this.isActiveItem(item.id)} add-entry-${item.name}`,
                    onClick: this.handleAddEntry.bind(null, item.id), key: i
                  },
                  dom.td(
                    null,
                    dom.small(null, `${ item.name } - ${ $.format(item.price) }`)
                  )
                );
              })
            )
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

