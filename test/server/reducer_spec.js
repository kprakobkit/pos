import { expect } from 'chai';
import reducer from '../../server/reducer';

describe('reducer', () => {
  describe('SET_STATE', () => {
    const item1 = 'Trainspotting';
    const item2 = '28 Days Later';

    it('handles SET_STATE', () => {
      const initialState = {};
      const newState = {
        vote: {
          pair:  [item1, item2],
          tally: { Trainspotting: 1 }
        }
      };
      const action = {
        type: 'SET_STATE',
        state: newState
      };
      const nextState = reducer(initialState, action);

      expect(nextState).to.deep.equal(newState);
    });

    it('handles SET_STATE without initial state', () => {
      const newState = {
        vote: {
          pair:  [item1, item2],
          tally: { Trainspotting: 1 }
        }
      };
      const action = {
        type: 'SET_STATE',
        state: newState
      };
      const nextState = reducer(undefined, action);

      expect(nextState).to.deep.equal(newState);
    });
  });

  describe('UPDATE_ORDER', () => {
    it('handles UPDATE_ORDER', () => {
      const initialState = {
        orders: [
          { id: 1 },
          { id: 2 }
        ]
      };
      const newState = {
        orders: [
          { id: 1 },
          { id: 2, foo: 'bar' }
        ]
      };
      const action = {
        type: 'UPDATE_ORDER',
        orderId: 2,
        order: {
          id: 2,
          foo: 'bar'
        }
      };
      const nextState = reducer(initialState, action);

      expect(nextState).to.deep.equal(newState);
    });
  });
});
