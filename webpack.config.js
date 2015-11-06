var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8081',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  module: {
    loaders: [{
      test:    /\.js$/,
      exclude: /node_modules/,
      loader:  'react-hot!babel'
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
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    proxy: {
      '*': 'http://localhost:' + (process.env.PORT || 3000)
    },
    host: 'localhost'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
