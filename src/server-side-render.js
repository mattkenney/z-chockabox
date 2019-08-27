import React from 'react';
import ReactDOMServer from 'react-dom/server';

import ApolloClient from 'apollo-client';
import serialize from 'serialize-javascript';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { getDataFromTree } from '@apollo/react-ssr';
import { makeExecutableSchema } from 'graphql-tools';

import App from './App';
import * as schema from './schema';

export default function () {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new SchemaLink({ schema: makeExecutableSchema(schema) }),
    ssrMode: true
  });

  const app = <App client={client}/>;

  return getDataFromTree(app).then(() => [
    '<script>',
    'window.__APOLLO_STATE__=',
    serialize(client.extract()),
    '</script>',
    ReactDOMServer.renderToString(app)
  ].join(''));
}
