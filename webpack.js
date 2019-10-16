'use strict';

const path = require('path');

var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    'server-side-render': './src/server-side-render.js'
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist')
  },
  target: 'node',
  externals: [nodeExternals({ whitelist: [
    /^react-bulma-components(\/|$)/
  ]})],
  node: {
    __dirname: false,
    __filename: false
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env', '@babel/react']
            }
          },
          { loader: 'eslint-loader' }
        ]
      },
      {
        test: /\.(css|sass)$/,
        use: [ 'ignore-loader' ]
      }
    ]
  }
};
