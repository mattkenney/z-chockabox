import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import ApolloClient from "apollo-boost";

import App from './App';

const options = {};

if (process.env.NODE_ENV !== 'production')
{
    options.uri = 'http://localhost:4000/graphql';
}

const client = new ApolloClient(options);

const root = document.getElementById('root');
const app = <App client={client}/>;

if (root.firstChild) {
  ReactDOM.hydrate(app, root);
} else {
  ReactDOM.render(app, root);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
