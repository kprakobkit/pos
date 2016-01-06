import { expect, spy } from 'chai';
import remoteActionMiddleware from '../src/remote_action_middleware';

function setup() {
  const socket = {
    emit: spy(),
    on: spy()
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
  it('creates on success event if action has one', () => {
    const { socket, dispatchWith } = setup();

    const action = {
      onSuccess: {
        type: 'type',
        onSuccess: 'on success'
      }
    };
    const dispatched = dispatchWith(action);

    expect(socket.on).to.have.been.called.with('type', 'on success');
  });
});
