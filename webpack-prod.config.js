var webpack = require('webpack');

module.exports = {
  entry: [
    './src/index.js'
  ],
  module: {
    loaders: [{
      test:    /\.js$/,
      exclude: /node_modules/,
      loader:  'babel'
    },
    {
      test: /\.css$/,
      loader: 'style!css'
    }]
  },
  resolve: {
    extensions: ['', '.js']
  },
  output: {
    path:       __dirname + '/dist',
    publicPath: '/',
    filename:   'bundle.js'
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
