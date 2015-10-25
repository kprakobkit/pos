import { Map } from 'immutable';

const INITIAL_STATE = Map();

function setState(state, newState) {
  return state.merge(newState);
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case 'SET_STATE':
    return setState(state, action.state);
  }
  return state;
}
