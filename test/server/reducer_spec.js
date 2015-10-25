import { expect } from 'chai';
import { List, Map, fromJS } from 'immutable';

import reducer from '../../server/reducer';

describe('reducer', () => {
  const item1 = 'Trainspotting';
  const item2 = '28 Days Later';

  it('handles SET_STATE', () => {
    const initialState = Map();
    const action = {
      type: 'SET_STATE',
      state: Map({
        vote: Map({
          pair:  List.of(item1, item2),
          tally: Map({ Trainspotting: 1 })
        })
      })
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        pair:  [item1, item2],
        tally: { Trainspotting: 1 }
      }
    }));
  });

  it('handles SET_STATE with plain JS payload', () => {
    const initialState = Map();
    const action = {
      type: 'SET_STATE',
      state: {
        vote: {
          pair:  [item1, item2],
          tally: { Trainspotting: 1 }
        }
      }
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        pair:  [item1, item2],
        tally: { Trainspotting: 1 }
      }
    }));
  });

  it('handles SET_STATE without initial state', () => {
    const action = {
      type: 'SET_STATE',
      state: {
        vote: {
          pair:  [item1, item2],
          tally: { Trainspotting: 1 }
        }
      }
    };
    const nextState = reducer(undefined, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        pair:  [item1, item2],
        tally: { Trainspotting: 1 }
      }
    }));
  });
});
