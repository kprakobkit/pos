import { Component, PropTypes, DOM as dom } from 'react';
import _ from 'ramda';

class MasterItemsSelect extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.isActiveCategory = this.isActiveCategory.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleAddEntry = this.handleAddEntry.bind(this);
    const filteredItems = this.filterItems(this.props.masterItems[0].category);
    this.state = {
      filteredItems,
      selectedItemId: filteredItems[0].id,
      selectedCategory: filteredItems[0].category
    };
  };

  componentWillMount() {
    this.props.onSelectMasterItem(this.state.filteredItems[0]);
  }

  getCategories(masterItems) {
    return _.uniq(_.pluck('category', masterItems));
  }

  filterItems(category) {
    return _.pipe(
      _.filter(_.propEq('category', category)),
      _.sortBy(_.prop('name'))
    )(this.props.masterItems);
  }

  handleChange(itemId) {
    const selectedItem = _.find(_.propEq('id', itemId), this.props.masterItems);
    this.props.onSelectMasterItem(selectedItem);
    this.setState({ selectedItemId: selectedItem.id });
  }

  handleAddEntry(itemId) {
    this.handleChange(itemId);
    this.props.onAddItem();
  }

  handleChangeCategory(category) {
    const filteredItems = this.filterItems(category);
    this.props.onSelectMasterItem(filteredItems[0]);
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
                className: `btn btn-default category category-${category} ${this.isActiveCategory(category)}`,
                key: i,
                onClick: this.handleChangeCategory.bind(null, category)
              }, category);
            })
          )
        ),
        dom.table(
          { className: 'table table-hover' },
          dom.tbody(
            { className: 'select-item' },
            this.state.filteredItems.map((item, i) => {
              return dom.tr(
                {
                  className: `item item-${item.name} ${this.isActiveItem(item.id)}`,
                  onClick: this.handleChange.bind(null, item.id), key: i
                },
                dom.td(
                  null,
                  item.name
                ),
                dom.td(
                  { className: 'col-md-3' },
                  this.isActiveItem(item.id) ? dom.button({
                    className: 'btn btn-primary add-item',
                    onClick: this.handleAddEntry.bind(null, item.id)
                  },
                  dom.span(
                    {
                      className: 'glyphicon glyphicon-plus',
                      'aria-hidden': true
                    }
                  )) : null
                )
              );
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

