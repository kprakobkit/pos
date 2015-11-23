import { Component, PropTypes, DOM as dom } from 'react';
import { connect } from 'react-redux';
import actions from '../action_creators';
import constants from '../constants';
import _ from 'underscore';

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

  componentWillMount() {
    this.props.loadOrders();
    const openEntries = _.filter(this.props.orders[0].entries, (entry) => entry.status === constants.OPEN);

    this.setState({ openEntries });
  }

  componentWillReceiveProps(props) {
    const openEntries = _.filter(this.props.orders[0].entries, (entry) => entry.status === constants.OPEN);

    this.setState({ openEntries });
  }

  render() {
    return dom.div(
      null,
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
  orders: [{}]
};

export default Chef;
export const ChefContainer = connect(
  mapStateToProps,
  actions
)(Chef);
