import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import constants from '../../src/constants';
import _ from 'ramda';

class ApplyDiscount extends Component {
  constructor(props) {
    super(props);
    this.renderDiscounts = this.renderDiscounts.bind(this);
    this.handleAddDiscount = this.handleAddDiscount.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.state = {
      discounts: this.props.appliedDiscounts
    };
  }

  handleAddDiscount(discount) {
    const { _id } = discount;
    const idx = _.findIndex(_.propEq('_id', _id))(this.state.discounts);
    const updatedDiscounts = idx > -1 ?
      _.remove(idx, 1)(this.state.discounts) :
      this.state.discounts.concat(discount);

    this.setState({ discounts: updatedDiscounts });
  }

  handleSave() {
    this.props.saveDiscounts(this.state.discounts);
    this.props.closeModal();
  }

  renderDiscounts(discount) {
    const { description, _id } = discount;
    const isSelected = _.find(_.propEq('_id', _id))(this.state.discounts);

    return(
      dom.tr(
        {
          className: `discount ${isSelected ? 'success' : ''}`,
          key: _id,
          onClick: this.handleAddDiscount.bind(null, discount)
        },
        dom.td(null, description)
      )
    );
  }

  render() {
    return (
      dom.div(
        { className: 'modal-content' },
        dom.div(
          { className: 'modal-header' },
          dom.h4({ className: 'modal-title inline' }, 'Discount'),
          dom.button({
            className: 'close',
            type: 'button',
            onClick: this.props.closeModal
          }, dom.span(null, 'x'))
        ),
        dom.div(
          { className: 'modal-body' },
          dom.table(
            { className: 'table table-hover' },
            dom.tbody(
              null,
              this.props.masterDiscounts.map(this.renderDiscounts)
            )
          ),
          dom.button({ className: 'btn btn-primary btn-block save-discounts', onClick: this.handleSave }, 'Save')
        )
      )
    );
  }
}

ApplyDiscount.propTypes = {
  closeModal: PropTypes.func.isRequired,
  masterDiscounts: PropTypes.array.isRequired,
  appliedDiscounts: PropTypes.array.isRequired,
  saveDiscounts: PropTypes.func.isRequired
};

export default ApplyDiscount;
