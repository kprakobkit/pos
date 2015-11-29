import mongoose from 'mongoose';
import config from '../config';
import _ from 'underscore';

process.env.NODE_ENV = 'test';

function clearDB() {
  const removeCollectionsPromise = _.map(mongoose.connection.collections, (collection) => {
    return new Promise((resolve, reject) => {
      collection.remove((err) => {
        if(err) {
          reject(err);
        }

        resolve();
      });
    });
  });

  return Promise.all(removeCollectionsPromise);
}

beforeEach((done) => {
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.testDB, (err) => {
      if (err) {
        throw err;
      }

      clearDB().then(() => { done(); });
    });
  } else {
    clearDB().then(() => { done(); });
  }
});

afterEach((done) => {
  mongoose.disconnect();
  done();
});
