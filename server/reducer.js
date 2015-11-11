import constants from '../src/constants';
import _ from 'underscore';

const INITIAL_STATE = {};

function setState(state, newState) {
  return _.extend({}, state, newState);
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case constants.SET_STATE:
    return setState(state, action.state);
  }

  return state;
}
