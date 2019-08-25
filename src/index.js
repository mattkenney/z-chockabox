import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import ApolloClient from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';

import App from './App';

const options = {};

if (window.__APOLLO_STATE__)
{
    options.cache = new InMemoryCache().restore(window.__APOLLO_STATE__);
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
