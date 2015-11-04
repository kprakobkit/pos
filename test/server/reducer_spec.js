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

  describe('ADD_ORDER', () => {
    it('adds an order', () => {
      const initialState = {
        orders: [
          { id: 1, status: 'open' }
        ]
      };
      const newOrder = { id: 2, status: 'status' };
      const action = {
        type: 'ADD_ORDER',
        order: newOrder
      };
      const newState = reducer(initialState, action);

      expect(newState.orders).to.contain(newOrder);
    });
  });
});
