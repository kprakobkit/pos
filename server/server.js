import { createFactory } from 'react';
import Server from 'socket.io';
import express from 'express';
import path from 'path';
import { renderToString } from 'react-dom/server';
import { RoutingContext as RoutingContextComponent, match } from 'react-router';
import { Provider as ProviderComponent } from 'react-redux';
import createLocation from 'history/lib/createLocation';
import mongoose from 'mongoose';
import makeStore from './store';
import socketEvents from './socket_events';
import routes from '../src/routes';
import config from '../config';
import socketioAuth from 'socketio-auth';
import jwtoken from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import _ from 'ramda';
import User from '../models/user';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.PORT : 3210;
const distPath = path.resolve(__dirname, '..', 'dist');
const store = makeStore();
const RoutingContext = createFactory(RoutingContextComponent);
const Provider = createFactory(ProviderComponent);
const verify = (token, callback) => jwtoken.verify(token, 'secret', {}, callback);
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const io = Server.listen(server);

const MongoDB = mongoose.connect(process.env.MONGOLAB_URI || config.developmentDB).connection;
MongoDB.on('error', (err) => {
  console.log('Failed to connect go Mongo DB');
  console.log(err.message);
});
MongoDB.once('open', () => {
  console.log('Connected to Mongo DB');
});

app.use(express.static(distPath));
app.use(cookieParser());
app.use((req, res) => {
  const location = createLocation(req.url);
  const token = req.cookies._posToken;

  match({ routes, location }, (err, redirectLocation, renderProps) => {
    verify(token, (err, decoded) => {
      if (err) {
        console.error(err);
        res.clearCookie('_posToken');
        return res.redirect(302, '/');
      }

      if (!renderProps) return res.status(404).end('Not found');

      const user = {
        name: decoded.name
      };
      const initialState = _.merge(store.getState(), { user, token });
      const rehydratedStore = makeStore(initialState);
      const InitialComponent = Provider(
        { store: rehydratedStore },
        RoutingContext(renderProps)
      );
      const componentHTML = renderToString(InitialComponent);

      const HTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"></link>
          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          </script>
        </head>
        <body>
          <div id="app">${componentHTML}</div>
          <script type="application/javascript" src="/bundle.js"></script>
        </body>
      </html>
      `;

      res.end(HTML);
    });
  });
});

const attachSocketEvents = socketEvents(store);
store.subscribe(
  () => io.emit('state', store.getState())
);
io.on('connection', (socket) => {
  socket.emit('state', store.getState());
});

io.on('connection', attachSocketEvents);
socketioAuth(io, {
  timeout: 'none',
  authenticate: (socket, { pin, token }, callback) => {
    if(pin) {
      User.findOne({ pin }).then(((user) => {

        if(user) {
          const { name } = user;
          const token = jwtoken.sign({ user: { name } }, 'secret', { expiresIn: '24h' });

          return callback(null, { token, user: { name } });
        } else {
          return callback(new Error('Invalid login'));
        }
      }));
    }

    if(token) {
      verify(token, (err, decoded) => {
        if(err) {
          return callback(new Error('failed to verify token'));
        }

        return callback(null, { token, user: decoded.user });
      });
    }
  }
});
