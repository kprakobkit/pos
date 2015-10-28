import * as constants from '../src/constants';

const INITIAL_STATE = {};

function setState(state, newState) {
  return Object.assign({}, state, newState);
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case constants.SET_STATE:
    return setState(state, action.state);
  }
  return state;
}
