import { Component, PropTypes, DOM as dom, createFactory } from 'react';
import { connect } from 'react-redux';
import { Link as LinkComponent } from 'react-router';
import actions from '../action_creators';
import constants from '../constants';
import _ from 'underscore';

const Link = createFactory(LinkComponent);

function mapStateToProps(state) {
  return {
    orders: state.orders
  };
}

class Chef extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openEntries: []
    };
  }

  setOpenEntries(orders) {
    const allEntries = _.reduce(orders, (entries, order) => entries.concat(order.entries), []);
    const openEntries = _.filter(allEntries, (entry) => entry.status === constants.OPEN);
    this.setState({ openEntries });
  }

  componentWillMount() {
    this.props.loadOrders();
    this.setOpenEntries(this.props.orders);
  }

  componentWillReceiveProps(props) {
    this.setOpenEntries(props.orders);
  }

  render() {
    return dom.div(
      null,
      dom.p(null, Link({ to: '/', className: 'orders-link' }, 'Home')),
      this.state.openEntries.map(
        (entry, i) => dom.div(
          { key: i, className: 'open-entry' },
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
