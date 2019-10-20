import React from 'react';
import ReactDOM from 'react-dom';
//import * as serviceWorker from './serviceWorker';

import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from "react-router-dom";
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import App from './App';

const cache = new InMemoryCache();

if (window.__APOLLO_STATE__)
{
    cache.restore(window.__APOLLO_STATE__);
}

const client = new ApolloClient({
  cache,
  link: createUploadLink({ credentials: 'same-origin' })
});

const root = document.getElementById('root');

const app = (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </ApolloProvider>
);

if (root.firstChild) {
  ReactDOM.hydrate(app, root);
} else {
  ReactDOM.render(app, root);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
