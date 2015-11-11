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

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.PORT : 3000;
const distPath = path.resolve(__dirname, '..', 'dist');
const store = makeStore();
const RoutingContext = createFactory(RoutingContextComponent);
const Provider = createFactory(ProviderComponent);

const MongoDB = mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost').connection;
MongoDB.on('error', (err) => {
  console.log('Failed to connect go Mongo DB');
  console.log(err.message);
});

MongoDB.once('open', () => {
  console.log('Connected to Mongo DB');
});

console.log('Server running...');

app.use(express.static(distPath));
app.use((req, res) => {
  const location = createLocation(req.url);

  match({ routes, location }, (err, redirectLocation, renderProps) => {
    if (err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }

    if (!renderProps) return res.status(404).end('Not found');

    const InitialComponent = Provider(
      { store },
      RoutingContext(renderProps)
    );

    const initialState = store.getState();

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
          <script type="application/javascript" src="bundle.js"></script>
        </body>
      </html>
    `;

    res.end(HTML);
  });
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = Server.listen(server);

const attachSocketEvents = socketEvents(store);

io.on('connection', (socket) => {
  console.log('connected!');
  socket.emit('connected', 'hello from the server');
  socket.emit('state', store.getState());
});

io.on('connection', attachSocketEvents);

store.subscribe(
  () => io.emit('state', store.getState())
);
