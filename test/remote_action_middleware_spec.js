import { expect, spy } from 'chai';
import remoteActionMiddleware from '../src/remote_action_middleware';

function setup() {
  const eventListeners = {};
  const socket = {
    emit: spy(),
    on: spy((type) => {
      eventListeners[type] = ['listener'];
    }),
    listeners: (type) => eventListeners[type] || []
  };
  const next = spy();
  const dispatchWith = (action) => {
    return remoteActionMiddleware(socket)({})(next)(action);
  };

  return {
    socket,
    dispatchWith
  };
}

describe('Remote Action Middleware', () => {
  it('creates on success listener if action has one', () => {
    const { socket, dispatchWith } = setup();
    const action = {
      onReceipt: {
        type: 'type',
        onSuccess: 'on success'
      }
    };
    const dispatched = dispatchWith(action);

    expect(socket.on).to.have.been.called.with('type', 'on success');
  });

  it('does not create listener for action if socket already has one', () => {
    const { socket, dispatchWith } = setup();
    const action = {
      onReceipt: {
        type: 'type',
        onSuccess: 'on success'
      }
    };

    dispatchWith(action);
    dispatchWith(action);

    expect(socket.on).to.have.been.called.once;
  });
});
