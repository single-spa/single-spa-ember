const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/single-spa-ember.js'),
  output: {
    filename: 'single-spa-ember.js',
    library: 'single-spa-ember',
    libraryTarget: 'amd',
    path: path.resolve(__dirname, 'amd'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: 'babel-loader',
      },
    ],
  },
  devtool: 'sourcemap',
};
