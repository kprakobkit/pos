import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import { Link as LinkComponent } from 'react-router';
import actions from '../action_creators';
import constants from '../constants';

const Link = createFactory(LinkComponent);
const displayMax = 6;

function mapStateToProps(state) {
  return {
    orders: state.orders
  };
}

function toOpenEntries(orderId, entry, entryIndex) {
  return {
    orderId,
    entry,
    entryIndex
  };
}

class Chef extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      openEntries: []
    };
  }

  setOpenEntries(orders) {
    const allEntries = orders.reduce((entries, order) => entries.concat(order.entries.map(toOpenEntries.bind(null, order.id))), []);
    const openEntries = allEntries.filter(({ entry }) => entry.status === constants.OPEN).slice(0, displayMax);
    this.setState({ openEntries });
  }

  componentWillMount() {
    this.props.loadOrders();
    this.setOpenEntries(this.props.orders);
  }

  componentWillReceiveProps(props) {
    this.setOpenEntries(props.orders);
  }

  handleClick(orderId, entryIndex) {
    this.props.changeEntryStatus(orderId, entryIndex, constants.COMPLETED);
  }

  render() {
    return dom.div(
      null,
      dom.p(null, Link({ to: '/', className: 'orders-link' }, 'Home')),
      this.state.openEntries.map(
        ({ orderId, entry, entryIndex }, i) => dom.div(
          {
            key: i,
            className: 'open-entry',
            onClick: this.handleClick.bind(null, orderId, entryIndex, constants.COMPLETED)
          },
          entry.name
        )
      )
    );
  }
}

Chef.propTypes = {
  orders: PropTypes.array.isRequired
};

Chef.defaultProps = {
  orders: [{
    entries: [{}]
  }]
};

export default Chef;
export const ChefContainer = connect(
  mapStateToProps,
  actions
)(Chef);
