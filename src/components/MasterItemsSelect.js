import { Component, PropTypes, DOM as dom } from 'react';

class MasterItemsSelect extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  };

  handleChange(e) {
    const itemId = e.target.value;
    this.props.onSelectMasterItem(itemId);
  }

  render() {
    return (
      dom.p(
        null,
        dom.select(
          { className: 'select-items form-control input-lg', onChange: this.handleChange },
          this.props.masterItems.map((item, i) => {
            return dom.option({ className: 'option', value: item.id, key: i + 1 }, item.name);
          })
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

